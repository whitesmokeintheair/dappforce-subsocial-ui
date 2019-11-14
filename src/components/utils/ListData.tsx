import React, { useState, useEffect } from 'react';
import { List, Select } from 'antd';
import Router, { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import Section from './Section';
const { Option } = Select;

type Props = {
  className?: string
  dataSource: any,
  renderItem: (item: any, index: number) => JSX.Element
  title?: React.ReactNode
};

export default (props: Props) => {
  const { dataSource,renderItem, className, title } = props;

  const DEFAULT_PAGE_SIZE = 1;
  const DEFAULT_CURENT_PAGE = 1;

  const router = useRouter();
  const routerQuery = router.query;

  const [ currentPage, setCurrentPage ] = useState(DEFAULT_CURENT_PAGE);
  const [ pageSize, setPageSize ] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    if (isEmpty(routerQuery)) {
      setPageSize(DEFAULT_PAGE_SIZE);
      setCurrentPage(DEFAULT_CURENT_PAGE);
      routerQuery.size = DEFAULT_PAGE_SIZE.toString();
      routerQuery.page = DEFAULT_CURENT_PAGE.toString();
      Router.push({
        pathname: router.pathname,
        query: routerQuery
      }).catch(console.log);
    } else {
      const page = parseInt(routerQuery.page as string, 10);
      const _pageSize = parseInt(routerQuery.size as string, 10);
      setCurrentPage(page > 0 ? page : DEFAULT_PAGE_SIZE);
      setPageSize(_pageSize > 0 && _pageSize < 100 ? _pageSize : DEFAULT_PAGE_SIZE);
    }
  }, [false]);

  const itemsSelect = [1,5,10,20,30,40,50,75,100];

  const SelectPageSize = () => (
    <Select
      style={{ width: '5rem' }}
      value={pageSize}
      onChange={(size: number) => {
        console.log(size);
        setPageSize(size);
        routerQuery.size = size.toString();
        Router.push({
          pathname: router.pathname,
          query: routerQuery
        }).catch(console.log);
      }}
    >
      {itemsSelect.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
    </Select>
  );

  return <Section title={<div className='DfTitle--List'>{title}<SelectPageSize/></div>}>
    <List
      className={'DfListData ' + className}
      itemLayout='vertical'
      size='large'
      pagination={{
        current: currentPage,
        defaultCurrent: DEFAULT_CURENT_PAGE,
        onChange: page => {
          setCurrentPage(page);
          routerQuery.page = page.toString();
          Router.push({
            pathname: router.pathname,
            query: routerQuery
          }).catch(console.log);
        },
        pageSize: pageSize
      }}
      dataSource={dataSource}
      renderItem={(item,index) => (
        <List.Item
          key={index}
        >
          {renderItem(item,index)}
        </List.Item>
      )}
    />
  </Section>
};