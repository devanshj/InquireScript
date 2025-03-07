# InquireScript

Let's say you want to make a survey that first asks "Which framework you like the most?" which has options "A", "B", "C". Now you want you next question to be "What do like the most about [selected frameword]?" with options as features of the selected framework.

Now the way you acheive this in most survey softwares is make these four questions on each section

- Which framework you like the most?
    * A
    * B
    * C
- What do like the most about A?
    * A feature 1
    * A feature 2
    * A feature 3
- What do like the most about B?
    * B feature 1
    * B feature 2
    * B feature 3
- What do like the most about C?
    * C feature 1
    * C feature 2
    * C feature 3

Then redirect the user to corresponding section based on the first answer, here's how it would look like in Google Forms

![](https://i.imgur.com/2191rrW.png)

![](https://i.imgur.com/RFSMiWr.png)

Making 3 sections, adding logic, working with the clunky UI is quite a tedious task. And remember we have only scratched the surface of what kind of logic you want to add, for extremely complex logic each of those available UI solutions would eventually fail.


What if you had a tool that takes this code...

```typescript
export default async function main(ui) {
    let framework = await ui.readChoiceList({
        label: "Which framework you like the most?",
        options: ["A", "B", "C"],
        id: 0
    })
    
    let feature = await ui.readChoiceList({
        label: `What do like the most about ${framework}?`,
        options:
            framework === "A"
                ? [
                    "A feature 1",
                    "A feature 2",
                    "A feature 3"
                ] :
            framework === "B"
                ? [
                    "B feature 1",
                    "B feature 2",
                    "B feature 3"
                ] :
            framework === "C"
                ? [
                    "C feature 1",
                    "C feature 2",
                    "C feature 3"
                ] :
            [],
        id: 1
    })
    
    return [framework, feature]
}
```

... and converts into a full-fledge GUI survey hosted on the internet which also stores the responses from your audience?
Well you have that tool now, it's called InquireScript

Also remember that we run your code in the wild, so you could integrate with your system or database, fetch questions do whatever you want, sky is the limit with InquireScript.
