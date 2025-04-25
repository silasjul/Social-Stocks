FROM python:3.11-slim

# Definer Chrome-version
ENV CHROME_VERSION=135.0.7049.114

# Installer nødvendige systempakker
RUN apt-get update && apt-get install -y \
    unzip curl gnupg ca-certificates \
    libglib2.0-0 libnss3 libgconf-2-4 libfontconfig1 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxi6 \
    libxtst6 libatk-bridge2.0-0 libgtk-3-0 libxrandr2 \
    libasound2 libxshmfence-dev libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Download og installer Chrome
RUN curl -sSL https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip -o chrome.zip && \
    unzip chrome.zip && \
    mv chrome-linux64 /opt/chrome && \
    ln -s /opt/chrome/chrome /usr/bin/google-chrome

# Download og installer Chromedriver
RUN curl -sSL https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chromedriver-linux64.zip -o chromedriver.zip && \
    unzip chromedriver.zip && \
    mv chromedriver-linux64/chromedriver /usr/local/bin/chromedriver && \
    chmod +x /usr/local/bin/chromedriver

# Opsæt arbejdsmappe og installer Python-afhængigheder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Standardkommando
CMD ["python", "scraper.py"]
