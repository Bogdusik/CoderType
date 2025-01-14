# CryptoChartApp

CryptoChartApp is an intuitive application designed to provide real-time visualization of cryptocurrency prices. By leveraging the CoinMarketCap API, it displays dynamic, interactive charts for selected cryptocurrencies and calculates price changes over various time intervals. Whether you're a trader or an enthusiast, this app helps you monitor market trends with ease.

## Features
- **Real-Time Cryptocurrency Tracking**: Stay up-to-date with the latest price movements.
- **Interactive Line Charts**: Visualize price changes with smooth, interactive charts.
- **Time Interval Price Analysis**: View price changes over the last minute, hour, day, and week.
- **Customizable Display**: Adjust the number of cryptocurrency charts displayed in the application.
- **Modern User Interface**: A sleek and visually appealing design for enhanced usability.

## Requirements
To get started, you'll need:
1. An account on [CoinMarketCap](https://coinmarketcap.com/api/).
2. A personal API key from the CoinMarketCap API dashboard.

## Setup Instructions
Follow these steps to set up and run the application:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/CryptoChartApp.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd CryptoChartApp
   ```

3. **Insert Your API Key**:
   Open the `CryptoAPI.java` file and replace `<YOUR_API_KEY>` with your API key:
   ```java
   private static final String API_KEY = "<YOUR_API_KEY>";
   ```

4. **Build the Project**:
   Use Maven to build the application:
   ```bash
   mvn clean install
   ```

5. **Run the Application**:
   Launch the app using Maven:
   ```bash
   mvn exec:java
   ```

6. **Customize the Display** (Optional):
   Adjust the number of cryptocurrency charts displayed by increasing or decreasing the value in the `Main.java` file:
   ```java
   private static final int NUMBER_OF_CHARTS = <desired number>;
   ```

When the application starts, it will open a window displaying real-time cryptocurrency charts and price change labels.

## How It Works
1. The application retrieves live cryptocurrency data from the CoinMarketCap API in JSON format.
2. The JSON data is parsed to extract relevant price and time interval information.
3. Dynamic charts are generated using the JFreeChart library and updated every second using a Timer.
4. Price changes over multiple time frames are calculated and displayed alongside the charts.

## Dependencies
This project relies on the following libraries:
- **Spring Boot**: For handling API requests.
- **Jackson Databind**: For parsing JSON data.
- **JFreeChart**: For creating and displaying charts.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements
Special thanks to:
- [CoinMarketCap API](https://coinmarketcap.com/api/) for providing real-time cryptocurrency data.

## Future Enhancements
- Adding support for more time intervals (e.g., monthly and yearly trends).
- Enabling user-specific cryptocurrency selections via a configuration file or UI.
- Providing advanced analytics, such as average price trends or market comparisons.

With CryptoChartApp, you'll gain insights into cryptocurrency trends in real time. Adjust it to suit your needs and explore the dynamic world of digital assets.
