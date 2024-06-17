# Algorithm for Best Driver Match and Payment Calculation

## Project Description

The "Algorithm for Best Driver Match and Payment Calculation" project is designed to identify the most suitable drivers based on user-provided start and end locations. This algorithm leverages geographical data to compute distances between locations using a third-party service and dynamically calculates the total payment for each driver. Payments are calculated in dollars by converting driver-specific currencies and incorporating distance-based and driver-specific rates.

The function accepts two dynamic parameters: the start location and the end location, both of which are determined by the user from a city-lat-lng JSON file. The algorithm provides a structured output with the total distance and driver payment in dollars, considering multiple variables such as distance tiers and driver-specific multipliers and fuel rates.

## Key Features

1. **Dynamic Location Input:** Accepts any start and end locations from the provided city-lat-lng JSON file.
2. **Distance Calculation:** Utilizes third-party services to determine the distance between two locations based on latitude and longitude.
3. **Payment Calculation:** Computes driver payment in dollars using distance-based rates, driver-specific multipliers, and fuel rates.
4. **Currency Conversion:** Converts rates from driver-specific currencies to dollars using a provided currency conversion JSON file.
5. **Detailed Output:** Returns a detailed result with driver IDs, total distance in kilometers, and total driver payment in dollars.

## Sample Output

```json
{
  "driverId": 1,
  "totalKM": "200Km",
  "driverPay": "$4200"
},
{
  "driverId": 6,
  "totalKM": "100Km",
  "driverPay": "$2100"
},
{
  "driverId": 3,
  "totalKM": "50Km",
  "driverPay": "$1050"
}
```

## Rate Descriptions
### Distance-wise Rate ($ per KM):
- 0-50 KM: 50
- 51-100 KM: 47
- 101-150 KM: 45
- 151-200 KM: 43
- 201+ KM: 40

### Driver-specific Rate Description:
- Driver ID 2: Rate 1.3x, Fuel Rate $7 per KM
- Driver ID 6: Rate 1.5x, Fuel Rate $9 per KM
- Driver ID 1: Rate 0.8x, Fuel Rate $11 per KM
- Other Drivers: Rate 1x, Fuel Rate $8 per KM

### Example Calculation
For Driver A (ID: 1) traveling 120 KM:

- Distance-wise Rate: 120 * 43 = $5160
- Driver-specific Rate: $5160 * 1.3 = $6708
- Driver-Fuel-specific Rate: 120 * 7 = $840
- Total Rate: $6708 + $840 = $7548

This project provides a comprehensive solution for matching drivers with tasks and calculating their payments accurately, considering various dynamic factors.

