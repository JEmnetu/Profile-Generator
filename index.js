const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');


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

                console.log(resp);
                const username = resp.data.login;
                const name = resp.data.name;
                const profileURL = resp.data.html_url;
                const followerCount = resp.data.followers;
                const followingCount = resp.data.following;
                const repoAmt = resp.data.public_repos;
                const bioText = resp.data.bio;
                const userAvatar = resp.data.avatar_url;
                const locationQueryURL = 'https://www.google.com/maps/search/?api=1&query=' + resp.data.location;
                console.log('Github URL: ' + profileURL);
                console.log(followerCount + ' Followers.');
                console.log('Followed By; ' + followingCount);
                console.log('Bio: ' + bioText);
                console.log('Image URL: ' + userAvatar);
                console.log('Location URL: ' + locationQueryURL);
                const page = `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                </head>
                
                <body>
                    <img src="` + userAvatar + `" alt="Github Avatar" height="250" width="250">
                    <h1>Greetings!</h1>
                    <h1>My Name is  ` + name + `! </h1>
                    <a href=` + locationQueryURL + ` target='_blank' <span id="location">` + resp.data.location + `</span></a> <a href=` + profileURL + ` target='_blank'><span id="Github">Github</span></a>
                
                    <h3>` + bioText + `</h3>

                    <section id='repos'>Public Repos:<br>${repoAmt}</section>
                    <section id='followers'>Followers:<br>${followerCount}</section>
                    <section id='stars'></section>
                 <section id='following'>Following:<br>${followingCount}</section>
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

                            console.log(element.name + ' ' + element.stargazers_count);
                            starCount += element.stargazers_count;
                        });
                        console.log(name + ' has ' + starCount + ' Github stars');


                    })
            })



    }
    // console.log('test' + queryUrl2);
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