---
title: "Teaching Cybersecurity through Gameplay"
description: "Designing a board game to teach cybersecurity concepts to beginners."
publishDate: 2025-08-23
---

What comes to your mind when you think of the words "board game"?

Many people immediately think of Monopoly or Uno.

Not to sound like a board game hipster, but when I think of "board games", I think of more niche games like Wingspan, or Settlers of Catan (which I consider responsible for the board game renaissance we're currently in).

Those more niche board games served as the inspiration for Cyber Attack, a board game that teaches basic cybersecurity principles to those who play. This was the capstone project I worked on this summer along with 5 other teammates at UC Berkeley for our Master's in Cybersecurity.

## Game objective
The objective of the game is simple: defend of attack.

Players can choose between different personas, all of which map to either a defender or an attacker. If you play as a defender, your goal is to defend your network. If you play as an attacker, your goal is to infiltrate the network. Simple as that!

## Personas
In order to make the gameplay more interesting, we added different personas for players to choose from. Each persona represents a different archetype found in the world of cybersecurity.

For defenders, we have:

* The CEO
* The IT Director
* The Data Analyst
* Hobbyist

For attackers, we have:

* Script Kiddie
* Professional Cyber Criminal
* The Hacktivist
* Insider Threat

Each Persona comes with different attributes, bonuses or objectives. For example, the Hacktivist's goal is to embarrass the Defender company, so they have a specific objective to infiltrate and steal secrets. If the Hacktivist is able to infiltrate the Defender network, the game is over.

The Script Kiddie has a highly variable success rate and must roll the dice to see if their script worked. This serves to mimic the actions of attackers who simply copy and paste code with various degrees of success.

The Insider Threat gets bonus points for Lateral Movement, since they're working from inside the Defender company, but also have a penalty for Secrecy, as they are more closely monitored within the network.

## Gameplay
Defenders and Attackers must move through the board and choose to attack or defend different areas of the network, such as:

* Workstations
* Email server
* Web server
* Printers

As players move to various areas of the board to defend or attack, players can also play cards relevant to that area. For example:

![Persona Cards](/blog/teaching-cybersecurity/persona-cards.png)

An Attacker can launch a Cyber Attack from Email, as a response, a Defender could deploy a Spam Filter. In this example, the IT Director persona gets a bonus to their action as part of their attributes.

### Win condition
The win condition is something we worked on and tried to really hash out to make it easy to understand, but also still be realistic to a real-life scenario.

How the win condition is met is as follows:

Once an Attacker launches their attack against the Defender, a counter starts running, like a clock. The Attacker has 15 tries to infiltrate the Defender network, and the Defender also has 15 tries to mitigate the damage.

If the Attacker is able to infiltrate the Defender network, and the Defender is not able to mitigate the attack, the Attacker wins. If the Attacker fails to infiltrate the network at all before the counter reaches 0, the Defender wins.

Most games would have a win condition like "collect the most money" or "get the most points", and while we could have perhaps chosen a game mechanic tied to money or stock value, we think that would have made game play harder to understand.

For those reasons, we chose to go with whether the attack is successful or not.

### Designing the game with (some) AI
While I have a background in Graphic Design, I am by no means an illustrator.

There were several types of cards we would need. We would need action cards, which is how most of the gameplay would occur. For those, I kept the design very simple. I chose emojis as icons because, again, I'm not really an illustrator.

![Play Cards](/blog/teaching-cybersecurity/play-cards.png)

The rest of the cards that needed to be designed were the Persona cards. This is where I used AI to help me with the rest of the designs.

> I should really stress that I used AI due to my own artistic limitations, and because we were in a time crunch for this project to produce a working prototype of the game. Under different circumstances, we would have hired and paid an artist.

![Inspiration](/blog/teaching-cybersecurity/inspo.png)

I am a huge fan of the game The Resistance, and I knew I wanted the Persona cards in our game to feel as unique and different as they do in this game.

Since, again, I am not an illustrator, I used Midjourney to bring the illustrations I had in mind to life. Here are some examples:

The Script Kiddie persona:
![Script Kiddie](/blog/teaching-cybersecurity/script-kiddie.png)

The CEO persona:
![CEO](/blog/teaching-cybersecurity/CEO.png)

We based our Persona cards on our real-life classmates, so I described what each person looked like to Midjourney, and then also described the scene, and that is how I came up with the prompts. It sounds easy, but it took me hours to get the images I was envisioning.

### The limitations of AI for design

The biggest struggle using AI to create illustrations is how often AI would get the prompt wrong, specifically when I described women. As a woman in tech, I found it really, really discouraging to describe:

"A female manager working in IT wearing headphones on a computer desk" and I would get whatever this is as a result:

![Female IT Manager by way of D&D](/blog/teaching-cybersecurity/midjourney2.png)

I guess it is a woman, and she is wearing headphones, but this did not meet the mark of "female manager".

Another example where I became frustrated was for the prompt "hand drawn realistic illustrated art work of a female data analyst working at her desk in an office."

![Too much cleavage for the office](/blog/teaching-cybersecurity/midjourney1.png)

This is fine, but I felt the outfit was still not very IT professional, so we tried again.

I'm not ready to unpack why it was so hard for Midjourney to make me art work of women who look professional without being too overly, ahem, sexy, but I got there eventually.

## Outcomes & the future
For a game we had 3 months to produce from start to finish, I think we did great! Our game won the [Summer 2023 Lily L. Chang award for best capstone project](https://medium.com/berkeleyischool/uc-berkeley-cybersecurity-students-devise-tactical-board-game-to-simulate-cyber-warfare-84337c5c5565).

This was the first physical product produced for a capstone project, so it was a first for the program.

The judges mentioned the impact this could have to make cybersecurity awareness more accessible as a reason why they chose our project as the winner.

Our hope is that a game like this could be used both to attract new people to the cybersecurity space, while also serving as good team-building exercise at the corporate level.

For the moment, we're taking a break from the game, but we may decide to actually bring this to market sometime in the future.
