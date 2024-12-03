import { useQuery } from "@tanstack/react-query";
import { Documents, getDucuments } from "../../api/Documents";
import type { TableColumnsType } from "antd";
import { queryClient } from "../../api/queryClient";
import { getUser, Users } from "../../api/User";
import { Table as AntTable } from "antd";
import styles from "./table.module.scss";

interface DataType {
  key: React.Key;
  documentName: string;
  count: number;
  [key: string]: string | number | React.Key;
}

interface LoginMap {
  [key: string]: string;
}

export const Table = () => {
  const userData = useQuery<Users>(
    {
      queryFn: () => getUser(),
      queryKey: ["user"],
      retry: false,
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
    },
    queryClient
  );

  const documentsData = useQuery<Documents>(
    {
      queryFn: () => getDucuments(),
      queryKey: ["documents"],
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
    },
    queryClient
  );

  const retry = () => {
    userData.refetch();
    documentsData.refetch();
  };

  switch (userData.status) {
    case "success": {
      // Создаем объект для поиска логина по id пользователя
      const loginMap = userData.data.reduce<LoginMap>((acc, user) => {
        acc[user.id] = user.login;
        return acc;
      }, {});

      const dataSource = documentsData.data?.map((item) => {
        const usersStatus = item.users.reduce<Record<string, string>>(
          (acc, userId) => {
            const login = loginMap[userId];
            if (login) {
              acc[login] = "+";
            }
            return acc;
          },
          {}
        );

        return {
          key: item.id,
          documentName: item.name,
          count: item.users.length,
          ...usersStatus,
        };
      });

      const columsData = userData.data.map((item) => {
        return { title: item.name, key: item.login, dataIndex: item.login };
      });

      const columns: TableColumnsType<DataType> = [
        {
          title: "Document name",
          width: 140,
          key: "documentName",
          dataIndex: "documentName",
          fixed: "left",
        },
        {
          title: "Amount of orders",
          width: 120,
          dataIndex: "count",
          key: "count",
          fixed: "left",
          sorter: {
            compare: (a, b) => a.count - b.count,
          },
          defaultSortOrder: "descend",
        },
        ...columsData,
      ];

      return (
        <AntTable<DataType>
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: "max-content" }}
          pagination={{
            total: dataSource?.length,
            showSizeChanger: true,
          }}
        />
      );
    }
    case "error": {
      return (
        <div className={styles.notification}>
          <p className={styles.error}>Error fetching data</p>
          <button className={`btn-reset ${styles.retry}`} onClick={retry}>
            Try again
          </button>
        </div>
      );
    }
  }
};
