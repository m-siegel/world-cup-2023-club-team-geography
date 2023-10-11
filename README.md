# World Cup 2023 Club Team Geography

Visualize geographic distribution of FIFA Women's World Cup 2023 players' club teams.

**NOTE: This data was scraped, but not verified, so the information presented may be incorrect. If you notice an inacuracy, please let me know.**

## Project Layout

This project involved several steps and includes several sub-packages and directories containing code for those steps.

- ***common*** contains the common classes and methods for the project.
- ***scraper*** contains methods for scraping the relevent data and writing it to json files.
- ***filterMap*** contains methods for filtering a GeoJSON file from [NaturalEarth](https://www.naturalearthdata.com/) to keep just the desired attributes.
- ***datastore*** is a rough mock of a database and data access object that work for a static site. It contains team and player information and the world map, as well as methods to access them.
- ***The root folder*** contains the files for the web page.

The code in *common*, *scraper* and *filterMap* packages is rough and not necessary for the webpage data visualization. The directories are included here because of their use in the early, data gathering stages of the project.

## Learning Goals
In addition to wanting to be able to see the geographic distribution of FIFA WWC players' club teams, I chose this project to learn (and re-learn) some web-dev skills. I used this project to
- refresh my **HTML**, **CSS** and **JS** knowledge (it had been a while since I used them),
- practice vanilla **CSS** and **JS** (build without the aid of Bootstrap, React, etc.),
- learn basic **d3.js** functionality,
- learn about geographic data representations, and
- learn how to us JS for **web scraping**.

## Thanks to
- [Wikipedia](https://www.wikipedia.org/) and [FoxSports](https://www.foxsports.com/) for their data and their allowance of web scraping.
- [NaturalEarth](https://www.naturalearthdata.com/) for the map data, and [Mapshaper](https://mapshaper.org/) for an easy way to convert it to GeoJSON.
- Peter Cook for the [d3 in Depth tutorials](https://www.d3indepth.com/).
- Ania Kubów's for this web scraping [youtube tutorial](https://www.youtube.com/watch?v=-3lqUHeZs_0).
