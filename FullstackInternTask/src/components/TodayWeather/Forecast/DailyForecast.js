import React, { useState } from 'react';
import { Grid, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import DailyForecastItem from './DailyForecastItem';
import ErrorBox from '../../Reusable/ErrorBox';
import Layout from '../../Reusable/Layout';

const DailyForecast = ({ data, forecastList }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const noDataProvided =
    !data ||
    !forecastList ||
    Object.keys(data).length === 0 ||
    data.cod === '404' ||
    forecastList.cod === '404';

  const convertTemp = (temp) => {
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum)) return 'N/A';
    if (isCelsius) return tempNum.toFixed(1);
    return ((tempNum * 9) / 5 + 32).toFixed(1);
  };

  const handleUnitChange = () => {
    setIsCelsius(!isCelsius);
  };

  let subHeader;
  let content;
  let minMaxTemp;

  if (!noDataProvided && forecastList.length > 0) {
    const temperatures = forecastList.map(item => parseFloat(item.temperature)).filter(temp => !isNaN(temp));
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);

    subHeader = (
      <Typography
        variant="h5"
        component="h5"
        sx={{
          fontSize: { xs: '10px', sm: '12px' },
          textAlign: 'center',
          lineHeight: 1,
          color: '#04C4E0',
          fontFamily: 'Roboto Condensed',
          marginBottom: '1rem',
        }}
      >
        {forecastList.length === 1
          ? '1 available forecast'
          : `${forecastList.length} available forecasts`}
      </Typography>
    );

    minMaxTemp = (
      <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
            color: 'white',
            fontFamily: 'Poppins',
          }}
        >
          Min: {convertTemp(minTemp)}° | Max: {convertTemp(maxTemp)}° {isCelsius ? 'C' : 'F'}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={!isCelsius}
              onChange={handleUnitChange}
              color="primary"
            />
          }
          label={isCelsius ? "Switch to °F" : "Switch to °C"}
          sx={{ color: 'white' }}
        />
      </Box>
    );

    content = (
      <Grid
        item
        container
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: 'fit-content',
        }}
        spacing="4px"
      >
        {forecastList.map((item, idx) => (
          <Grid
            key={idx}
            item
            xs={4}
            sm={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              marginBottom: { xs: '1rem', sm: '0' },
            }}
          >
            <DailyForecastItem 
              item={{
                ...item,
                temperature: convertTemp(item.temperature),
              }} 
              data={data}
              unit={isCelsius ? 'C' : 'F'}
            />
          </Grid>
        ))}
      </Grid>
    );
  } else if (noDataProvided) {
    content = <ErrorBox flex="1" type="error" />;
  } else if (forecastList && forecastList.length === 0) {
    subHeader = (
      <ErrorBox
        flex="1"
        type="info"
        margin="2rem auto"
        errorMessage="No available forecasts for tonight."
      />
    );
  }

  return (
    <Layout
      title="TODAY'S FORECAST"
      content={
        <>
          {minMaxTemp}
          {content}
        </>
      }
      sectionSubHeader={subHeader}
      sx={{ marginTop: '2.9rem' }}
      mb="0.3rem"
    />
  );
};

export default DailyForecast;