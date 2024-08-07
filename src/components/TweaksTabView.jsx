import { useState } from 'react';
import {
  Box,
  Stack,
  Tab,
  Tabs,
  Typography,
  tabClasses,
  tabsClasses
} from '@mui/material';

import Filter from './Filter';
import Envelope from './Envelope';
import KeyRecorder from './recorder/KeyRecorder';
import Tempo from './tempo/Tempo';


export const tabsStyles = () => ({
  root: {
    backgroundColor: "#eee",
    borderRadius: "10px",
    minHeight: 44,
  },
  flexContainer: {
    position: "relative",
    padding: "0 3px",
    zIndex: 1,
  },
  indicator: {
    top: 3,
    bottom: 3,
    right: 3,
    height: "auto",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px 0 rgba(0,0,0,0.16)",
  },
});

export const tabItemStyles = (theme) => ({
  root: {
    fontWeight: 500,
    minHeight: 44,
    minWidth: 96,
    opacity: 0.7,
    color: (theme.vars || theme).palette.text.primary,
    textTransform: "initial",
    "&:hover": {
      opacity: 1,
    },
    [`&.${tabClasses.selected}`]: {
      color: (theme.vars || theme).palette.text.primary,
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 120,
    },
  },
});

function CustomTabPanel(props) {
  const { children, value, activeValue, keepMounted, ...other } = props;

  const isActive = value === activeValue;
  const isMounted = isActive || keepMounted;

  return (
    <div
      role="tabpanel"
      hidden={value !== activeValue}
      {...other}
    >
      {isMounted && (
        <Box
        textAlign="center"
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}


function TweaksTabView() {
  const [activeTab, setActiveTab] = useState('record');

  const handleTabChange = (event, value) => {
    setActiveTab(value)
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Tabs
          flex="1"
          variant="fullWidth"
          value={activeTab}
          onChange={handleTabChange}
        >
          <Tab value="filter" label="Filter" />
          <Tab value="record" label="Record" />
          <Tab value="tempo" label="Tempo" />
          <Tab value="envelope" label="Envelope" />
        </Tabs>
      </Box>
      <CustomTabPanel activeValue={activeTab} value="filter">
        <Filter />
      </CustomTabPanel>
      
      <CustomTabPanel keepMounted activeValue={activeTab} value="record">
        <KeyRecorder />
      </CustomTabPanel>

      <CustomTabPanel keepMounted activeValue={activeTab} value="tempo">
        <Tempo />
      </CustomTabPanel>
    
      <CustomTabPanel activeValue={activeTab} value="envelope">
        <Envelope />
      </CustomTabPanel>
    </Box>
  )
}

export default TweaksTabView;
