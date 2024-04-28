import { cookies } from "next/headers";
import { connectToDatabase } from "./mongoose";
import axios from "axios";
import User from "@/database/user.model";
import { createUser } from "./actions/user.action";
import { redirect } from "next/navigation";

type Mahasiswa = {
  id_user: number;
  nama: string;
  username: string;
  email: string;
  password: string;
  role: string;
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
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARDHOME_URL || "";
  if (!token) {
    return redirect(dashboardUrl);
  }
  return token.value;
}

export const currentProfile = async () => {
  const userToken = getUserToken(); // Updated to camelCase
  // Using Cookie and use ProfileId, but for now we will use the hardcoded profileId
  await connectToDatabase();
  console.log("token : ", userToken);
  const url = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  console.log("url : ", url);
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`, // Updated to camelCase
      Accept: "application/json",
    },
  };

  // Check if the profile exists
  const userData = (await axios.get<Mahasiswa>(`${url}/user`, config)).data;
  console.log("user data dashboard : ", userData);
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
      role: userData.role,
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
      // Update userId with the string representation of the _id field
      await User.updateOne(
        { _id: createdProfile._id },
        { $set: { userId: createdProfile._id.toString() } },
      );
    }
  } else {
    console.log("Profile already exists Tanya Jawab:", existingProfile);
  }
  if (existingProfile) {
    return existingProfile;
  }
};
