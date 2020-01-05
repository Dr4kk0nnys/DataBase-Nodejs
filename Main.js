const fs = require("fs")
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let dataBase = {
    content: []
}

const Write = () => { // It writes stuff to the data base ( it does not take paramaters, because in the ReadUserInput() method, the input gets added to the dataBase << ARRAY >> through the push() method )
    fs.writeFile("dataBase.txt", dataBase.content.toString().replace(/[,]/g, "\n"), (err) => {
        if (err) {
            throw new Error("Error trying to add term to the data base")
        }
    })
}

const ReadUserInput = () => { // It uses the readline.question() to get the user input ( the readline was imported )
    readline.question("> ", (data) => {
        let splicedData = data.split(" ") // It splices the user input to this array

        if (splicedData[0] == "exit") {
            readline.close()
            return
        } else if (splicedData[0] == "delete") {
            try {
                if (splicedData.length <= 2) { // If the user typed: "delete __something__" ( 2 length )
                    ClearSingleTerm(splicedData[1])
                } else if (splicedData.length >= 3) { // If the user typed: "delete __something__ __something__" ( 3+ length ) ( so you can add stuff wit spaces => "Speak with someone" )
                    let sanitizedArray = { // I had to create this array, because the shift() method sucks, and just returns it, and i couldn't do it with splice ( in the future i could change this )
                        content: [] // empty array
                    }
                    for (let i = 1; i < splicedData.length; i++) { // Note: To remove the first element, i starts with value 1
                        sanitizedArray.content.push(splicedData[i])
                    } // It passes every item ( except the first one ( "delete" )) to the sanitizedArray
                    ClearSingleTerm(sanitizedArray.content.toString().replace(/[,]/g, "_")) // And it removes the object
                }
            } catch {
                console.log("Something went wrong trying to delete the single term")
            }
            ShowArray()
            ReadUserInput()
            return
        } else if (splicedData[0] == "deleteAll") {
            ClearAllDataBase()
            ClearAllArray()
            ShowArray()
            ReadUserInput()
            return
        } else if (splicedData[0] == "show") {
            ShowArray()
            ReadUserInput()
            return
        }

        data = data.replace(/[ ]/g, "_") // It replaces every blank space (" ") with a ("_")
        dataBase.content.push(data) // Then it pushes the element to the array, as a single one, instead of multiple elements
        Write()
        console.log("The file was sucessfully saved!\n")
        ShowArray()
        ReadUserInput()
    })
}

const Read = (start, shouldCallUserInput, term) => { // Basically the core
    fs.readFile("dataBase.txt", "utf8", (err, data) => {
        if (err) {
            throw new Error("Something went wrong, while trying to read the data base")
        }

        if (start && shouldCallUserInput) { // Initializes the database ( reading the database, and adding to the dataBase << ARRAY >> )
            data = data.split("\n")

            for (let i = 0; i < data.length; i++) {
                dataBase.content.push(data[i])
            }

            ShowArray()
            ReadUserInput()
        } else { // This else is entirely for the ClearSingleTerm method
            data = data.split("\n")
            let index = data.indexOf(term)

            if (index > -1) {
                data.splice(index, 1)
            }

            ClearAllArray() // Cleaning both dataBase << ARRAY >> 
            ClearAllDataBase() //                           and dataBase << DATABASE >>

            for (let i = 0; i < data.length; i++) {
                dataBase.content.push(data[i]) // It then adds all the data to the dataBase << ARRAY >
            }
            Write() // And then all the data to the dataBase << DATABASE >>
        }
    })
}

const ClearSingleTerm = (term) => {
    Read(false, false, term)
}

const ClearAllDataBase = () => {
    fs.writeFile("dataBase.txt", "", (err) => {
        if (err) {
            throw new Error("Errow while cleaning all the data base")
        }
    })
}

const ClearAllArray = () => {
    dataBase.content = []
}

const ShowArray = () => {
    console.log()
    for (let i = 0; i < dataBase.content.length; i++) {
        console.log(`Index ${i}: ${dataBase.content[i]}`)
    }
    console.log()
}

Read(true, true) // It starts the whole dataBase