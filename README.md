<div align="center">
<pre>
████████╗██████╗  █████╗ ██████╗ ███████╗███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
   ██║   ██████╔╝███████║██║  ██║█████╗  ███████╗██║   ██║██║     ██║███████║██║     
   ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  ╚════██║██║   ██║██║     ██║██╔══██║██║     
   ██║   ██║  ██║██║  ██║██████╔╝███████╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝
-------------------------------------------------------------------------------------
Stock market data and social media sentiment
</pre>

[![Next.js](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![Python](https://img.shields.io/badge/Python-3.13%2B-blue?style=flat&logo=python&logoColor=white)](https://www.python.org/) [![Docker](https://img.shields.io/badge/Docker-blue?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![Postgres](https://img.shields.io/badge/PostgreSQL-4169e1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Golang](https://img.shields.io/badge/Golang-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Description

The core idea behind TradeSocial is to leverage social media sentiment, to gauge potential impacts on the stock market. Tweets are scraped from selected influential figures and presented alongside relevant stock data to help traders make more informed decisions.

## Tech Stack

This project utilizes a combination of modern web technologies:

-   **Frontend:** [Next.js](https://nextjs.org/) React Framework
-   **Scraping:** [Python](https://www.python.org/) using FastAPI and Selenium
-   **Database:** [Postgres](https://www.postgresql.org/) using [Golang](https://go.dev/)
-   **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Features

-   **Stock Data Visualization:** View stock data.
-   **Influencer Tweet Feed:** Displays tweets scraped from the list of people you follow.
-   **Tweet Markers** Hover over the tweets to see where it was posted on the charts.

## Running the Project

To run the project, you will need to have [Docker](https://www.docker.com/) installed.

## A. You can run the project without login on X, but only super profiles can be seen, and only with selected posts!


1.  Run Docker Compose:

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images and start the containers.

2.  Access the application:

    Once the containers are running, you can access the application in your web browser at `http://localhost:3000`.

## B. If you have an accoiunt on X and wnat to have the full experience (Only Windows users)

1.  Comment out these lines 52 & 53 in \TradeSocial-posts-number\services\scraping-service\src\twitter.py

        self.options.add_argument("--headless=new") # <----- Comment out these line for login
        self.options.add_argument("--window-size=1920,1080") # <----- Comment out these line for login
2.  Run the Batch file start_chrome.bat

        It will create a folder for an extra profile (C:\Webdriver\temp\profile\Default) and open chrome.
        Chrome has to be in the default place on your computer for this i.e. C:\Program Files\Google\Chrome\Application\chrome.exe
        Otherwise change the bat file to match your custom folder for your chrome app

3.  In the window log in to your X account and close the window.

4.  Proceed with A 1 and A 2 above.
    
