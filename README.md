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

[![Next.js](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![Python](https://img.shields.io/badge/Python-3.13%2B-blue?style=flat&logo=python&logoColor=white)](https://www.python.org/) [![Docker](https://img.shields.io/badge/Docker-blue?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![Postgres](https://img.shields.io/badge/PostgreSQL-4169e1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Description

The core idea behind TradeSocial is to leverage social media sentiment, to gauge potential impacts on the stock market. Tweets are scraped from selected influential figures and presented alongside relevant stock data to help traders make more informed decisions.

## Tech Stack

This project utilizes a combination of modern web technologies:

-   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
-   **Backend/Scraping/Analysis:** [Python](https://www.python.org/) (using FastAPI and Selenium for scraping)
-   **Database:** [Postgres](https://www.postgresql.org/)
-   **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Features

-   **Stock Data Visualization:** View stock data.
-   **Influencer Tweet Feed:** Displays tweets scraped from the list of people you follow.
-   **Tweet Markers** Hover over the tweets to see where it was posted on the charts.
