import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import localforage from "localforage";
import { requestGetBookings, requestGetListings } from "../../services/request";
import msgPopup from '../../utils/msgPopup';
import useEffectDeep from '../../hooks/useEffectDeep';
import { includes, isEqual, parseInt } from "../../utils/lodash";

const dateMaps = new Map();

export default function ProfitsGraph() {
  // eslint-disable-next-line no-unused-vars
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleData = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const booking of bookings) {
      // eslint-disable-next-line no-unused-vars
      const {
        dateRange: { start, end },
        status,
        totalPrice,
      } = booking;
      if (isEqual(status, 'accepted')) {
        const diff = dayjs().diff(dayjs(start), 'day');
        if (diff >= 0 && diff <= 30) {
          const internal = dayjs(end).diff(dayjs(start), 'day');
          const eachDayProfit = totalPrice / internal;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < internal; i++) {
            const temp = isEqual(dateMaps.get(diff - i), undefined) ? 0 : dateMaps.get(diff - i);
            dateMaps.set(diff - i, temp + eachDayProfit);
          }
        }
      }
    }
    setLoading(false);
  };

  const initGraphData = async () => {
    try {
      const user = await localforage.getItem('user');
      const {listings} = await requestGetListings();
      const myListings = [];
      listings.forEach(listing => {
        const {id, owner} = listing;
        if (isEqual(owner, user)) {
          myListings.push(id);
        }
      })
      const response = await requestGetBookings();
      // eslint-disable-next-line array-callback-return,consistent-return
      const myBookings = response.bookings.filter(booking => {
        if (includes(myListings, parseInt(booking.listingId))) {
          return booking;
        }
      })
      setBookings(myBookings);
      if (bookings.length !== 0) {
        handleData();
      }
      else {
        setLoading(false);
      }
      // handleData();
    } catch (error) {
      msgPopup(error.message);
    }
  };

  const initXAxis = () => [...new Array(31).keys()].reverse();

  // eslint-disable-next-line no-unused-vars
  const getGraphData = () => {
    const xAxis = initXAxis();
    const res = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const x of xAxis) {
      res.push(isEqual(dateMaps.get(x), undefined) ? 0 : dateMaps.get(x));
    }
    return res;
  };

  useEffectDeep(() => {
    initGraphData();
  }, [bookings]);

  // eslint-disable-next-line no-unused-vars
  const options = {
    title: { show: true, text: 'Past 30 days Profits' },
    xAxis: { data: initXAxis() },
    yAxis: { name: '$' },
    series: [
      {
        data: getGraphData(),
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  // eslint-disable-next-line no-unused-vars
  const loadingOption = {
    text: 'loading...',
    color: '#4413c2',
    textColor: '#270240',
    zLevel: 0,
  };

  // eslint-disable-next-line no-unused-vars
  function onReady(echarts) {
    echarts.hideLoading();
  }

  return (
    <>
      {loading ? (
        <ReactECharts
          option={options}
          style={{ paddingTop: 30, height: 400, width: 600 }}
          showLoading
          loadingOption={loadingOption}
        />
      ) : (
        <ReactECharts option={options} style={{ paddingTop: 30, height: 400, width: 400 }} />
      )}
    </>
  );
}
