import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import * as dayjs from 'dayjs';
import isBetween from 'dayjs/esm/plugin/isBetween';
import { Card, Radio, Statistic, Table, Tag } from 'antd';
import { AttachMoney as AttachMoneyIcon, Today as TodayIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  requestAcceptBooking,
  requestDeclineBooking,
  requestGetBookings,
  requestGetOneListing,
} from '../../services/request';
import msgPopup from '../../utils/msgPopup';
import useEffectDeep from '../../hooks/useEffectDeep';
import 'antd/es/table/style/index.css';
import 'antd/es/tag/style/index.css';
import 'antd/es/radio/style/index.css';
import 'antd/es/card/style/index.css';
import 'antd/es/statistic/style/index.css';
import { isEqual } from '../../utils/lodash';
import Header from '../../components/Header';

dayjs.extend(isBetween);

const { Column } = Table;

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [duration, setDuration] = useState(null);
  const [total, setTotal] = useState(null);

  const { id } = useParams();

  const history = useHistory();

  const getTableData = () => {
    const temp = [];

    bookings.forEach(booking => {
      const {
        id: _id,
        dateRange: { start, end },
        status,
        totalPrice,
      } = booking;
      temp.push({
        id: _id,
        start: dayjs(start).format('DD/MM/YYYY'),
        end: dayjs(end).format('DD/MM/YYYY'),
        status,
        totalPrice,
        key: _id,
      });
    });

    setTableData(temp);
  };

  const handleGetListing = () => {
    requestGetOneListing(id)
      .then(async response => {
        const { postedOn } = response.listing;
        const diff = dayjs().diff(dayjs(postedOn), 'd');
        setDuration(diff);
        return { ...response };
      })
      .catch(error => ({ ...error }));
  };

  const getBookings = async () => {
    try {
      const response = await requestGetBookings();
      let temp = [];
      let price = 0;
      // eslint-disable-next-line array-callback-return,consistent-return
      temp = response.bookings.filter(booking => {
        const { listingId, totalPrice, status } = booking;
        if (isEqual(listingId, id)) {
          if (isEqual(status, 'accepted')) {
            price += totalPrice;
          }
          return booking;
        }
      });
      setTotal(price);
      setBookings(temp);

      getTableData();
    } catch (error) {
      msgPopup(error.message);
    }
  };

  useEffectDeep(() => {
    getBookings();
    handleGetListing();
  }, [bookings, duration, total]);

  const handleGoBack = () => {
    history.goBack();
  }

  // TODO: not render immediately
  return (
    <>
      <Header />
      <Table dataSource={tableData}>
        <Column align='center' title='ID' dataIndex='id' key='id' />
        <Column align='center' title='Start' dataIndex='start' key='start' />
        <Column align='center' title='End' dataIndex='end' key='end' />
        <Column align='center' title='Total Price' dataIndex='totalPrice' key='totalPrice' />
        <Column
          align='center'
          title='Status'
          dataIndex='status'
          key='status'
          render={text => {
            switch (text) {
              case 'accepted':
                return <Tag color='green'>{text}</Tag>;
              case 'declined':
                return <Tag color='red'>{text}</Tag>;
              case 'pending':
                return <Tag color='blue'>{text}</Tag>;
              default:
                return <Tag color='yellow'>unknown</Tag>;
            }
          }}
        />
        {/* eslint-disable-next-line consistent-return */}
        <Column
          title='Action'
          key='action'
          render={record => {
            const { id: _id, status } = record;
            if (isEqual(status, 'pending')) {
              return (
                <Radio.Group buttonStyle='outline'>
                  <Radio.Button
                    onClick={() => {
                      requestAcceptBooking(_id)
                        .then(response => {
                          msgPopup('Accept the booking successfully', 'success');
                          history.push('/host');
                          return { ...response };
                        })
                        .catch(error => ({ ...error }));
                    }}>
                    Accept
                  </Radio.Button>
                  <Radio.Button
                    onClick={() => {
                      requestDeclineBooking(_id)
                        .then(response => {
                          msgPopup('Decline the booking successfully', 'success');
                          history.push('/host');
                          return { ...response };
                        })
                        .catch(error => ({ ...error }));
                    }}>
                    Decline
                  </Radio.Button>
                </Radio.Group>
              );
            }
            return null;
          }}
        />
      </Table>
      {!isEqual(duration, null) && (
        <Card>
          <Statistic
            title='Duration'
            value={isEqual(duration, NaN) ? 0 : duration}
            valueStyle={{ color: '#3f8600' }}
            prefix={<TodayIcon />}
            suffix='day(s)'
          />
        </Card>
      )}
      {total && (
        <Card>
          <Statistic
            title='Total Profit'
            value={isEqual(total, NaN) ? 0 : total}
            valueStyle={{ color: '#cf1322' }}
            prefix={<AttachMoneyIcon />}
          />
        </Card>
      )}
      <Button variant='contained' style={{ marginTop: 20, marginLeft: 20 }} name="backProfit" onClick={handleGoBack}>
        Go Back
      </Button>
    </>
  );
}
