
# CloudWeather – Serverless Geospatial Dashboard ☁️🌍

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

**Live Demo:** https://dmjobm9f4s38w.cloudfront.net/

CloudWeather is a highly available, serverless web application that provides real-time global weather tracking. Built with cloud-native principles, it leverages AWS for edge-optimized content delivery and features a fully automated CI/CD pipeline for zero-downtime deployments.



## ✨ Features
* **Interactive Geospatial Map:** Integrated with Leaflet.js and OpenStreetMap to allow users to click anywhere on the globe for instant weather data via latitude/longitude mapping.
* **Real-Time Data Integration:** Asynchronously fetches live weather conditions, temperatures, and descriptions using the OpenWeatherMap REST API.
* **Global Edge CDN:** Served via AWS CloudFront, ensuring low-latency load times worldwide and enforcing secure HTTPS encryption.
* **Automated Deployments:** A GitHub Actions CI/CD pipeline automatically syncs code to S3 and invalidates the CloudFront cache upon every push to the `main` branch.

## 🛠️ Architecture & Tech Stack
* **Cloud Infrastructure:** Amazon S3 (Static Web Hosting), AWS CloudFront (CDN), AWS IAM (Least-Privilege Security)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **APIs & Libraries:** OpenWeatherMap API, Leaflet.js
* **DevOps / CI/CD:** GitHub Actions, AWS CLI

## 🚀 Local Setup & Installation

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ceastin/cloud-weather.git](https://github.com/ceastin/cloud-weather.git)
   cd cloud-weather
Get an API Key:

Create a free account at OpenWeatherMap.

Generate an API key.

Configure the API Key:

Open script.js.

Replace 'YOUR_API_KEY_HERE' on line 2 with your actual API key.

Run the app:

Simply open index.html in your web browser. No local server required!

## ☁️ Cloud Deployment Setup
This project is configured to deploy automatically to AWS. If you are setting this up in your own AWS environment, you will need:

An Amazon S3 Bucket configured for static website hosting with public read access.

An AWS CloudFront Distribution pointing to the S3 website endpoint, with a viewer policy set to Redirect HTTP to HTTPS.

An IAM User with AmazonS3FullAccess and CloudFrontFullAccess (or scoped-down custom policies for production).

## CI/CD Pipeline (GitHub Actions)
To enable the automated deployment workflow, add the following Repository Secrets in GitHub (Settings > Secrets and variables > Actions):

        AWS_ACCESS_KEY_ID: Your IAM user access key.

        AWS_SECRET_ACCESS_KEY: Your IAM user secret key.

        AWS_S3_BUCKET: The exact name of your S3 bucket.

        AWS_CLOUDFRONT_ID: The distribution ID of your CloudFront setup.

Once configured, any push to the main branch will **trigger the .github/workflows/deploy.yml** script, syncing files to S3 and invalidating the CDN cache automatically.
