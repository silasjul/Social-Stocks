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

[![Next.js](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![Python](https://img.shields.io/badge/Python-3.13%2B-blue?style=flat&logo=python&logoColor=white)](https://www.python.org/) [![Docker](https://img.shields.io/badge/Docker-blue?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

TradeSocial is a web application designed for traders, providing insights into potential market movements by analyzing tweets from influential figures alongside traditional stock data.

## Description

The core idea behind TradeSocial is to leverage social media sentiment, to gauge potential impacts on the stock market. We scrape tweets from selected influential individuals, analyze them to determine their potential market influence, and present this information alongside relevant stock data to help traders make more informed decisions.

## Tech Stack

This project utilizes a combination of modern web technologies:

-   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
-   **Backend/Scraping/Analysis:** [Python](https://www.python.org/) (using FastAPI, BeautifulSoup for scraping and gemini for tweet analysing)
-   **Database:** [MySQL](https://www.mysql.com/)
-   **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Features

-   **Stock Data Visualization:** View stock data.
-   **Influencer Tweet Feed:** Displays tweets scraped from the list of people you follow.
-   **Tweet Markers** Hover over the tweets to see where it was posted on the charts.
