import React from 'react'
import { useTable } from 'react-table'
import styles from './styles.module.css'

const TableComp = ({ data, columns }) => {
    const dataMemo = React.useMemo(() => data, [data])
    const columnsMemo = React.useMemo(() => columns, [columns])
    const tableInstance = useTable({ columns: columnsMemo, data: [...dataMemo,] })
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

    return (
        <div className={styles.tableContainer}>
            <table {...getTableProps()}>
                <thead style={{ backgroundColor: '#d3d3d3' }}>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, i) => (
                                <th key={i} {...column.getHeaderProps()} style={{}}>
                                    {column && column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody  {...getTableBodyProps()} style={{ display: 'block', overflow: 'auto', }}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr key={i} {...row.getRowProps()}>
                                {row.cells.map((cell, j) => {
                                    return (
                                        <td key={j} data-label={cell.column.Header} {...cell.getCellProps()} style={{}}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableComp;