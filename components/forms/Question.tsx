"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";



import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

import { useTheme } from "@/context/ThemeProvider";

import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { QuestionValidation } from "@/lib/validations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { userInfo } from "os";
import AnswersTab from "../shared/AnswersTab";
import QuestionsTab from "../shared/QuestionsTab";

interface Props {
  type: string;
  mongoUserId: string;
  questionDetails?: string;
}

const Question = ({ type, mongoUserId, questionDetails }: Props) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails || "");

  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionValidation>>({
    resolver: zodResolver(QuestionValidation),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
      anonymous: parsedQuestionDetails?.anonymous || false, // Set anonymous value to "CONTOH"
    },
  });
  

  async function onSubmit(values: z.infer<typeof QuestionValidation>) {
    setIsSubmitting(true);
    
    try {
        const { title, explanation, tags, anonymous } = values; // Destructure 'anonymous'
        console.log("Submitting with values:", values); // Log all form values

        if (type === "Edit") {
          await editQuestion({
            questionId: parsedQuestionDetails._id,
            title,
            content: explanation,
            anonymous, // Set anonymous value to "CONTOH"
            path: pathname,
          });
          router.push(`/question/${parsedQuestionDetails._id}`);
        } else {
          await createQuestion({
            title,
            content: explanation,
            tags,
            author: JSON.parse(mongoUserId),
            anonymous, // Set anonymous value to "CONTOH"
            path: pathname,
            
          });

          // navigate to home page
          router.push("/");
        }

    } catch (error) {
      toast({
        title: `Error ${type === "Edit" ? "editing" : "posting"} question ⚠️`,
        variant: "destructive",
      });
  
      console.error(error);
    } finally {
      setIsSubmitting(false);
  
      toast({
        title: `Question ${
          type === "Edit" ? "edited" : "posted"
        } successfully 🎉`,
        variant: "default",
      });
    }
  }
  
  
  

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          form.trigger();
        }
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    form.setValue(
      "tags",
      field.value.filter((t: string) => t !== tag)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
              <div className="flex justify-end">
                <div className="mt-10 flex">
                  <Tabs defaultValue="top-posts" className="flex-1 rounded-sm">
                    <TabsList className="background-light800_dark400 min-h-[42px] p-1 pt-2 rounded-sm">
                      <TabsTrigger value="top-posts" className="tab pl-5 pr-5 pt-1 pb-1" style={{fontSize: '0.85rem'}}>
                        My account
                      </TabsTrigger> 
                      <TabsTrigger value="answers" className="tab pl-5 pr-5 pt-1 pb-1"  style={{fontSize: '0.85rem'}}>
                        Anonim
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="top-posts"
                      className="mt-5 flex w-full flex-col gap-6"
                    >
                      {/* <QuestionsTab
                        searchParams={searchParams}
                        userId={userInfo.user._id}
                        clerkId={clerkId}
                      /> */}
                    </TabsContent>
                    <TabsContent value="answers" className="flex w-full flex-col gap-6">
                      {/* <AnswersTab
                        searchParams={searchParams}
                        userId={userInfo.user._id}
                        clerkId={clerkId}
                      /> */}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col mt-0">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Anonymous
              </FormLabel>
              <FormControl className="mt-3.5">
                <input
                  type="checkbox"
                  {...field}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  value={field.value ? 'true' : 'false'}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />





        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-5">
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails?.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter |" +
                      "alignright alignjustify | bullist numlist outdent indent",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduces the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col mt-3">
              <FormLabel className="paragraph-semibold text-dark400_light800 mt-5">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === "Edit"}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type !== "Edit"
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="Close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900 mt-10"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
