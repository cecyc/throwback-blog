---
title: "Building a Database from Real World Objects"
description: "Or how I built a database with binders and sharpies"
publishDate: 2025-05-02
---

![Hero Image -Cameron Bunney / Unsplash](/blog/building-a-database/hero.jpg)

When I was in college, I took on an internship at a film studio. The film studio was what is known as a "mini major" in industry lingo. That means it was more of a boutique studio, making more niche or arthouse style films.

While the studio doesn't exist anymore, unfortunately, there is an experience I had there that I still think about to this day. And that is how I created a sort of database out of real-world objects.

Now, as a software engineer, when I think of a database, I think about data in rows. Or columns if you're using a column-based database. I guess you can think of blobs if you're thinking NoSQL ;)

But in general, I think most software engineers think "data in rows" when they think of a database.

The database I designed as an intern at a mini major Hollywood studio did not consist of digital rows of data, but actual physical DVDs.

Let me explain.

As an intern at this film studio, I worked in the acquisitions department. My job was to watch films and write 1 page summaries / reviews called "coverage". These 1 pagers would then go into a Filemaker Pro database.

The idea is that the coverage would be there for Executives to read whenever they requested it, because Executives need to be in the know, but they also don't have time to watch everything. So they would need the broad strokes, and if something was blowing up, getting a lot of buzz, or tickled their fancy, we'd need to go hunt for the actual DVD (yes, this was back when DVDs were a thing!).

Except the DVDs were not kept in a way that made them easy to find whenever an Executive requested them. It was a wild west of DVDs. Some in boxes, some in paper sleeves, some in no case at all. All thrown into several drawers with no rhyme or reason.

This made it very difficult to actually locate DVDs when they were needed.

As a lowly intern with a lot of energy and self-determination, I decided I was going to solve the problem as best I could with what I had. And I had a Filemaker Pro database and lots of free office supplies.

I also had a lot of DVD binders such as the one below, all of which were not being used much.

![CD Binder](/blog/building-a-database/cd-binder.png)

Other than a great way to store DVDs, there's another great thing about these binders. They are a grid system!

![Grid](/blog/building-a-database/grid.png)

So I took all of our DVD binders and assigned them numbers. Binder 1 had 001 - 100, Binder 2 had 101 - 200, Binder 3 had 201 - 300, and so on.

I put all of the DVDs in the sleeve and also put a label on it with their number (so we knew which slot it needed to go back into).

I then input all of those numbers or IDs into Filemaker Pro.

Now, when you wanted to look up where a DVD was, you could look up the ID. If it was 156, you would know exactly how to locate that DVD by looking at the binders.

And the advantage now is that when we got new DVDs, we just got new binders and put the DVDs in the order they were received. No need to constantly alphabetize and re-arrange things.

The final product looked something like this, pardon the AI generated representation.

![Final Product](/blog/building-a-database/binders.webp)

Binders of DVDs with labels on the side, numbering 001 - 100, 101 - 200, and 201 - 300.
At the time, I didn't realize I was essentially designing a database, but now as a Software Engineer, I am blown away that a very young version of me, before I was a Software Engineer, with no direction and no real prior experience in database design, designed a simple database system out of binders and sharpie 😂.