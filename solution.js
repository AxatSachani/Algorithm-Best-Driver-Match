/*
The code has been designed to be reusable and clear to understand with a functional approach. 
Some sections may require adjustments based on specific requirements.
*/

const { getDistance } = require('geolib');
const fs = require('fs');

// Driver-specific rates 
const driverSpecificRate = [
    {
        driverID: 2,
        rate: 1.3,
        fuelRate: 7
    },
    {
        driverID: 6,
        rate: 1.5,
        fuelRate: 9
    },
    {
        driverID: 1,
        rate: 0.8,
        fuelRate: 11
    }
]

// Default rates for calculations
const defaultRate = 1, defaultFuelRate = 8

// Load city, driver and currency data from JSON files
const cityData = JSON.parse(fs.readFileSync('./assets/city-lat-lng.json', { encoding: 'utf8' }))
const driverData = JSON.parse(fs.readFileSync('./assets/driver.json', { encoding: 'utf8' }))
const currencyData = JSON.parse(fs.readFileSync('./assets/currency.json', { encoding: 'utf8' }))

// Function to find the best driver based on start and end locations
function findBestDriver(start, end) {

    // find the location coordinate (latitude longitude) of the journy place
    const startLocation = findLocation(start)
    const endLocation = findLocation(end)

    // Calculate distance between the start and end location in kilometers
    const distanceInKilometers = calculateDistance(startLocation, endLocation);

    // Find available drivers who are not hired 
    let availableDrivers = filterAvailableDrivers(driverData)

    // Calculate the amount and list out the required fields for each available driver(which can be change as per requirements)
    let drivers = availableDrivers.map(driver => {
        // Calculate total rate includes distanceRate, driverRate and fuelRate
        const { totalRate } = calculateRates(driver, distanceInKilometers);

        // convert currency into dollar
        const finalAmount = currencyConvertor(driver.currency, totalRate);

        return {
            driverID: driver.id,
            totalKM: `${distanceInKilometers}Km`,
            tripsCompleted: driver.tripsCompleted,
            experience: driver.experience,
            accidentRate: driver.accidentRate,
            driverReview: driver.driverReview,
            amount: finalAmount,
            driverPay: (Number(finalAmount)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        }
    })

    // sort driver by priority wise to find the best driver (which can be change as per requirements)
    drivers.sort((a, b) => (a.amount - b.amount && b.experience - a.experience && b.driverReview - a.driverReview && b.tripsCompleted - a.tripsCompleted && a.accidentRate - b.accidentRate))

    /**
     to find best driver i use this priority senario :
    1st priority to amount,
    2nd priority to experience,
    3rd priority to driverReview,
    4th priority to tripsCompleted and
    5th priority to accidentRate 

    this can be change as per the requirements
     */

    console.log({ drivers })
    return drivers
}


// Function to find the location based on the name
function findLocation(name) {
    name = name.trim().toLowerCase();
    return cityData.find(city => city.name.toLowerCase() === name);
}

// Function to calculate the distance between two locations
function calculateDistance(startLocation, endLocation) {
    const distanceInMeters = getDistance(startLocation, endLocation);
    return (distanceInMeters / 1000).toFixed(1);
}

// Function to filter available drivers who are not hired
function filterAvailableDrivers(driverData) {
    return driverData.filter(driver => !driver.isHired || driver.isHired === 'false');
}


// Function to calculate rates for each driver
function calculateRates(driver, distanceInKilometers) {
    const distanceRate = Number(driver.distanceBasedRate[findKMRange(distanceInKilometers)]);
    const driverRate = Number(driverSpecificRate[driver.id]?.rate || defaultRate);
    const fuelRate = Number(driverSpecificRate[driver.id]?.fuelRate || defaultFuelRate);
    const totalRate = (distanceRate + driverRate + fuelRate).toFixed(2);
    return { distanceRate, driverRate, fuelRate, totalRate };
}

// Function to determine the range of kilometers
function findKMRange(km) {
    if (km <= 50) return '0-50';
    else if (km <= 100) return '51-100';
    else if (km <= 150) return '101-150';
    else if (km <= 200) return '151-200';
    else return '200+';
}

// Function to convert currency into dollars
function currencyConvertor(currencyType, amount) {
    amount = Number(amount);
    if (currencyType !== '$') {
        let currencyRate = currencyData.find(currency => currency.fromCurrency === currencyType && currency.toCurrency === '$')
        currencyRate = Number(currencyRate.rate);
        amount = amount * currencyRate;
    }
    return amount.toFixed(2);
}


// Call the function to find the best driver for the given journey
findBestDriver('pune', 'Ahmedabad');