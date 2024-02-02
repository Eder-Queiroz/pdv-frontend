import { TableHTMLAttributes } from "react";

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  data: any[];
  columns: any[];
}

export const Table = ({ data, columns, ...rest }: TableProps) => {
  return (
    <div className="rounded-md border border-primary-400">
      <table {...rest} className="table-auto w-full text-light-100">
        <thead className="h-9 border-b border-primary-400">
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center border-b-tbody">
          {data.map((d, i) => (
            <tr
              className="h-12 border-primary-400 hover:bg-primary-500"
              key={i}
            >
              {columns.map((column, i) => (
                <td key={i}>{d[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
