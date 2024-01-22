'use server'

import { client } from "@/lib/db"
import { redirect } from 'next/navigation'

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData)

  // Create book id
  const id = Math.floor(Math.random() * 100_00)

  // add book to the sorted set
  const unique = await client.zAdd("books", {
    value: title,
    score: id,
  }, {
    NX: true,
  })

  if (!unique) {
    return { error: "Book already exists!" }
  }

  // save new book
  await client.hSet(`books:${id}`, {
    title, rating, author, blurb
  });

  redirect("/");
}
