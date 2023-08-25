import logo from './logo.svg';
// Importing modules
import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import Nav from './components/Nav';
import TwitterImg from './images/twitter.png';
import GmailImg from './images/gmail.png';
import GithubImg from './images/github.png';
import { RadialChart } from 'react-vis';


function App() {
  const [foundUser, setFoundUser] = useState(false);
  const [user, setUser] = useState("");
  const [invalidUser, setInvalidUser] = useState(false);
  // usestate for setting a javascript
  // object for storing and using data
  const [userData, setuserData] = useState({
    name: "",
    avatar_url: "",
    email: "",
    followers: 0,
    following: 0,
    username: "",
    company: null,
    owned_private_reposs: 0,
    public_repos: 0,
    twitter_username: null,
    url: ""
  });

  const [repoData, setrepoData] = useState({
    forks_count: 0,
    open_issues_count: 0,
    stargazers_count: 0,
    watchers_count: 0,
    mostStarRepo: "",
    mostForkedRepo: ""
  });
  const [publicPrivate, setpublicPrivate] = useState([]);
  //const [publicPrivate, setpublicPrivate] = useState([]);
  const [topicsChart, setTopicsChart] = useState([]);
  const [languagesChart, setLanguagesChart] = useState([]);
  //  const [mostStarRepo, setmostStarRepo] = useState("");
  //  const [mostForkedRepo, setmostForkedRepoo] = useState("");
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
      e.preventDefault();

      // Read the form data
      const form = e.target;
      const formData = new FormData(form);

      // You can pass formData as a fetch body directly:
      //fetch('/some-api', { method: form.method, body: formData });

      // Or you can work with it as a plain object:
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
      setUser(formJson.usernameSearch);
  }

  // Using useEffect for single rendering
  useEffect(() => {
    // Using fetch to fetch the api from
    // flask server it will be redirected to proxy
    if(user !== "")
    {
      console.log("Sunding "+user );
      const url = `http://localhost:5000/data/${user}`
      fetch(url, {method: 'GET'}).then(
      res => {

        res.json().then((data) => {
          console.log(data);
          if(data.status == 200)
          {
          setuserData({
            name: data.name,
            avatar_url: data.avatar_url,
            email: data.email,
            followers: data.followers,
            following: data.following,
            username : data.login,
            company : data.company,
            owned_private_repos : data.owned_private_repos,
            public_repos : data.public_repos,
            twitter_username : data.twitter_username,
            url : data.html_url
          });
          
          let total = data.public_repos + data.owned_private_repos;
          setpublicPrivate([
            { angle: data.public_repos, label: 'Public', percentage: data.public_repos/ total },
            { angle: data.owned_private_repos, label: 'Private', percentage: data.owned_private_repos / total},
          ]);
          setFoundUser(true);

          const repo = `http://localhost:5000/repo/${user}`
          //REPO CALL
          fetch(repo, { method: 'GET' }).then(
            res => {
      
              res.json().then((data) => {
                let maxStars = 0;
                let maxForks = 0;
                let starRepo = "";
                let forkRepo = "";
                let total_forks = 0;
                let total_open_issues = 0;
                let total_stars = 0;
                let total_watchers = 0;
                let size = data.length;
      
                const languageMap = new Map();
                const topicMap = new Map();
                for (let i = 0; i < size; i++) {
                  //console.log(data[i]);
                  const stars = data[i].stargazers_count;
                  const forks = data[i].forks_count;
                  const issues = data[i].open_issues_count;
                  const watchers = data[i].watchers_count;
                  const repo_name = data[i].name;
      
                  const language = data[i].language;
                  if (language != null)
                    if (languageMap.has(language)) {
                      const count = languageMap.get(language);
                      languageMap.set(language, count + 1);
                    }
                    else {
                      languageMap.set(language, 1);
                    }
      
                  const topics = data[i].topics;
                  if (topics.length != 0)
                    for (const element of topics) {
                      if (topicMap.has(element)) {
                        const count = topicMap.get(element);
                        topicMap.set(element, count + 1);
                      }
                      else {
                        topicMap.set(element, 1);
                      }  
                    }
                       
                  total_forks += forks;
                  total_open_issues += issues;
                  total_watchers += watchers;
                  total_stars += stars;
      
                  if (stars > maxStars) {
                    //set max;
                    starRepo = repo_name;
                    maxStars = stars;
                  }
      
                  if (forks > maxForks) {
                    forkRepo = repo_name;
                    maxForks = forks;
      
                  }
                }
      
                console.log("total_forks " + total_forks);
                console.log("total_open_issue " + total_open_issues);
                console.log("total_stars " + total_stars);
                console.log("total_watchers " + total_watchers);
                console.log("starRepo " + starRepo);
                console.log("forkRepo " + forkRepo);
                console.log("language " + languageMap);
                let total = 0;
                for (const value of languageMap.values()) {
                  total += value;
                }
                let lang = []
                for (const [key, value] of languageMap.entries()) {
                  lang.push({ angle: value, label: key, percentage: value / total })
                }
      
                total = 0;
                for (const value of topicMap.values()) {
                  total += value;
                }
                let top = []
                for (const [key, value] of topicMap.entries()) {
                  top.push({ angle: value, label: key, percentage: value / total })
                }
      
      
      
                setTopicsChart(top);
                setLanguagesChart(lang);
                setrepoData(
                  {
                    forks_count: total_forks,
                    open_issues_count: total_open_issues,
                    stargazers_count: total_stars,
                    watchers_count: total_watchers,
                    mostStarRepo: starRepo,
                    mostForkedRepo: forkRepo
                  }
                )
      
              })
            }
          );

        }
        else{
          setInvalidUser(true);
        }
      })
      }
    );
    }

  }, [user]);

  return (
    <div className="App">

      <Nav />
       {/* Form for username */}
        { !foundUser && 
         <div className="form-data wrapper">
          <div className="form-data container">
           <form method="get" onSubmit={handleSubmit}>
            <h2>
            Username : <input name="usernameSearch" defaultValue="kewalkishang" />
          </h2>
          <button type="submit">Search User</button>
          </form>
           {invalidUser && <h3>
            INVALID USER! try again!
           </h3>
           }
        </div>
        </div>
        }

         {/* User profile data  */}
       { foundUser && 
       <div>
       <div className='user-data wrapper'>
        <div className='user-profile'>
          <img className="user-img" src={userData.avatar_url}></img>
          <h1 className='name'>{userData.name}</h1>
          <p className='name'>@{userData.username}</p>
          <p className='name'>Company : {userData.company == null ? "Unknown" : userData.company}</p>
        </div>
        <div className='user-profile'>
          <div className='user-pro'>
           
          <div className='user-socials'>
          {/* <h2 className='name'>Socials</h2> */}
          {userData.twitter_username && <a target="_blank" href={'https://twitter.com/' + userData.twitter_username}><img className="social-img" src={TwitterImg} /> </a>
          }
          {userData.email && <a target="_blank" href={'mailto:' + userData.email}><img className="social-img" src={GmailImg} /></a>
          }
          <a target="_blank" href={userData.url}> <img className="social-img" src={GithubImg} /></a>
          </div>
          <h3 className='name'>Followers : {userData.followers}</h3>
          <h3 className='name'>Following : {userData.following}</h3>
        </div>
        </div>
      </div>

      {/* User repo data  */}
      <div className='repo-data wrapper'>
        <div>
        <h2 style={{ textDecoration : 'underline' }}>Repository Metrics</h2>
        </div>
        <div className='repo-stats'>
          <p className='name'>Forks : {repoData.forks_count}</p>
          <p className='name'>Stars : {repoData.stargazers_count}</p>
          <p className='name'>Watchers : {repoData.watchers_count}</p>
          <p className='name'>Issues : {repoData.open_issues_count}</p>
        </div>
        {/* <div class="div-with-line"></div> */}
        <div className='repo-stats'>
        <p className='name'>Most Starred : {repoData.mostStarRepo}</p>
        <p className='name'>Most Forked : {repoData.mostForkedRepo}</p>
        </div>
        <div className='repo-stats'>
        <RadialChart
          data={publicPrivate}
          width={300}
          height={300}
          innerRadius={50} // Set the inner radius for a donut chart effect
          showLabels
          labelRadiusOffset={10} // Adjust the offset for label distance from the center
          labelsRadiusMultiplier={0.8} // Adjust the multiplier for label distance
          labelsStyle={{ fontSize: 12 }}
          getLabel={(d) => `${d.label} - ${d.percentage.toFixed(2) * 100}%`}
        />
        <RadialChart
          data={languagesChart}
          width={300}
          height={300}
          innerRadius={50} // Set the inner radius for a donut chart effect
          showLabels
          labelRadiusOffset={10} // Adjust the offset for label distance from the center
          labelsRadiusMultiplier={0.8} // Adjust the multiplier for label distance
          labelsStyle={{ fontSize: 12 }}
          getLabel={(d) => `${d.label} - ${d.percentage.toFixed(2) * 100}%`}
        />
         <RadialChart
          data={topicsChart}
          width={300}
          height={300}
          innerRadius={50} // Set the inner radius for a donut chart effect
          showLabels
          labelRadiusOffset={10} // Adjust the offset for label distance from the center
          labelsRadiusMultiplier={0.8} // Adjust the multiplier for label distance
          labelsStyle={{ fontSize: 12 }}
          getLabel={(d) => `${d.label} - ${d.percentage.toFixed(2) * 100}%`}
        />
            </div>
      </div>
      </div>
    }
    </div>
  );
}

export default App;
