import { cookies } from "next/headers";
import { connectToDatabase } from "./mongoose";
import axios from "axios";
import User from "@/database/user.model";
import { createUser } from "./actions/user.action";
type Mahasiswa = {
  id_mhs: number;
  nama: string;
  username: string;
  email: string;
  password: string;
  tanggal_lahir: Date;
  location: string;
  about: string;
  kampus: string;
  jurusan: string;
  semester: number;
  token: string;
  profileUrl: string;
};
export function getUserToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("user_token");
  if (!token) {
    return "";
  }
  return token.value;
}
export const currentProfile = async () => {
  const user_token = getUserToken();
  //Using Cookie and use ProfileId, but for now we will use the hardcoded profileId
  await connectToDatabase();
  console.log("token : ", user_token);
  const url = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  console.log("url : ", url);
  const config = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      Accept: "application/json",
    },
  };
  // Check if the profile exists
  const userData = (await axios.get<Mahasiswa>(url + "/mahasiswa", config))
    .data;
  console.log("user data : ", userData);
  const existingProfile = await User.findOne({ email: userData.email });
  if (!existingProfile) {
    // Profile doesn't exist, create a dummy profile
    const dummyProfile = {
      userId: "CL123",
      name: userData.nama,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      bio: userData.about,
      picture: userData.profileUrl,
      location: userData.location,
      portfolioWebsite: "https://johndoe.portfolio.com",
      reputation: 0,
      saved: [],
      onboarded: true,
      joinedAt: new Date(),
    };

    // Save the dummy profile to the database
    const createdProfile = await createUser(dummyProfile);
    if (createdProfile) {
      console.log("Dummy profile created:", createdProfile);
      // Update userId with the string representation of the _id field
      await User.updateOne({ _id: createdProfile._id }, { $set: { userId: createdProfile._id.toString() } });
      console.log("userId updated:", createdProfile._id.toString());
    }
  } else {
    console.log("Profile already exists:", existingProfile);
  }
  if (existingProfile) {
    return existingProfile;
  }
};
