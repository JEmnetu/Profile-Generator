const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
const pdf = require('html-pdf');
const html = fs.readFileSync('./index.html', 'utf8');
const bgColor = process.argv[2];


//Function to generate PDF 
let savePDF = () => {
    const options = { format: 'A4' };
    pdf.create(html, options).toFile('./Github-Resume.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
}

// Function to query Github and pull profile info
let queryGithub = (response) => {
    const name = response.Name;
    const username = response.username;
    const queryUrl1 = `https://api.github.com/users/` + username;
    const queryUrl2 = `https://api.github.com/users/` + username + `/repos?per_page=100`;
    let starCount = 0;


    axios.get(queryUrl1)
        // Query user's profile data
        .then(function(resp) {

            // console.log(resp);
            const username = resp.data.login;
            const name = resp.data.name;
            const profileURL = resp.data.html_url;
            const followerCount = resp.data.followers;
            const followingCount = resp.data.following;
            const repoAmt = resp.data.public_repos;
            const bioText = resp.data.bio;
            const userAvatar = resp.data.avatar_url;
            const locationQueryURL = 'https://www.google.com/maps/search/?api=1&query=' + resp.data.location;
            // console.log('Github URL: ' + profileURL);
            // console.log(followerCount + ' Followers.');
            // console.log('Followed By; ' + followingCount);
            // console.log('Bio: ' + bioText);
            // console.log('Image URL: ' + userAvatar);
            // console.log('Location URL: ' + locationQueryURL);
            const page = `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                    <style>
                    body {
                        background-color:${bgColor};
                    }
                    
                    #avatar {
                        border: solid 6px gold;
                        border-radius: 40px;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        
                    }
                    #bio {
                        text-align: center;
                        margin-top: 3em;
                        margin-bottom: 2em;
                    }

                    section {
                        text-align: center;
                        display: block;
                        margin-left: 260px;
                        margin-top: 100px;
                        margin-right: auto;
                    }
                    
                    section p {
                        float: left;
                        margin-left: 2em;
                        background-color: white;
                        border-radius: 12px;
                        border: solid 6px black;
                        padding: 2em;
                        font-size: 1.5em;
                        font-weight: bold;
                    }
                    
                    header {
                        background-color: white;
                        margin: 3em 1em 0em 1em;
                        border-radius: 12px;
                        border:solid 6px black;
                    }
                    
                    header h1 {
                        text-align: center;
                    }
                    header a {
                        text-decoration: none;
                        color: black;
                        font-size: 1.5em;
                        margin: .5em;
                        text-align: center;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    
                    
                    
                    </style>
                </head>
            
                <body>
                <header>
                    <img id='avatar' src="` + userAvatar + `" alt="Github Avatar" height="250" width="250">
                    <h1>Greetings!</h1>
                    <h1>My Name is  ` + name + `! </h1>
                    <a href=${locationQueryURL} target='_blank' <span id="location">` + resp.data.location + `</span></a> <a href=` + profileURL + ` target='_blank'><span id="Github">Github</span></a>
                </header>
                <h2 id='bio'>${bioText}</h2>
                <section>
                    
                    <p id='repos'>Public Repos:<br>${repoAmt}</p>
                    <p id='followers'>Followers:<br>${followerCount}</p>
                 <p id='following'>Following:<br>${followingCount}</p>
                 </section>
                </body>

                
                </html>`;
            //Writes pulled information to index.html
            fs.writeFile('./index.html', page, (err) => { if (err) { console.log(err) } });

        })
        .then(function() {
            axios.get(queryUrl2)
                // Query user's repo data
                .then(function(resp2) {

                    // console.log(resp2.data);
                    // Loops thru each repo and keeps a count of how many are starred.
                    resp2.data.forEach(element => {

                        // console.log(element.name + ' ' + element.stargazers_count);
                        starCount += element.stargazers_count;
                    });
                    // console.log(name + ' has ' + starCount + ' Github stars');


                })
        })
        .then(savePDF);
    console.log(bgColor);


}

inquirer.prompt([{
        type: 'input',
        message: 'What is your name?',
        name: 'Name'
    }, {
        type: 'input',
        message: 'Enter your Github username',
        name: "username"
    }])
    .then(queryGithub);