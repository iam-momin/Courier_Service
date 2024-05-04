import axios from 'axios';
import React, { Component } from 'react';
import { AiOutlineFolderView } from 'react-icons/ai';
import CmrFormPopup from '../../../../components/CmrFormPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import TableComp from '../../../../components/TableComp';
import { API_HOST, HEADERS } from '../../../../constants';
import styles from './styles.module.css'

class CMR extends Component {
    constructor(props){
        super(props)
        this.state = {
            tableData: [],
            formData: {},
            showCmrFormPopup: false,
            showSuccessPopup: false,
            isSuccess: true

        }
        this.columns = [
            {
                Header: 'S/N',
                accessor: '',
                Cell: ({ row }) => <span className={styles.viewDetails}>{parseInt(row.id) + 1}</span>
            },
            {
                Header: 'Order ID',
                accessor: 'orderId'
            },
            {
                Header: 'Sender Name',
                accessor: 'senderName'
            },
            {
                Header: 'Sender Address',
                accessor: 'senderAddress'
            },
            {
                Header: 'Receiver Name',
                accessor: 'receiverName'
            },
            {
                Header: 'Receiver Address',
                accessor: 'receiverAddress'
            },
            {
                Header: 'Action',
                accessor: 'label',
                Cell: ({ row }) => {
                    return <div className={styles.viewDetails}>
                        <span title='View/Edit Cmr Invoice' className={'icon'} onClick={() => this.setState({ showCmrFormPopup: true, formData: row.original })} >
                            <AiOutlineFolderView style={{ color: 'var(--primary-color)', fontSize: '22px' }} />
                        </span>

                    </div>
                }
            }
        ]
    }

    componentDidMount(){
        this.getCmrData()
    }
    getCmrData=()=>{
        axios.get(`${API_HOST}/api/cmr`, HEADERS).then((res) => {
            let tableData = []
                res && res.data.map(item => {
                    tableData.push({
                        ...item,
                    })
                })
            this.allTableData = tableData
            this.setState({tableData})

        })
    }
    handleSubmit=(id, data)=>{
        axios.put(`${API_HOST}/api/cmr/${id}`, data, HEADERS)
        .then((res) => {
            const data = res.data
            const {tableData} = this.state
            let newTableData = []
            tableData && tableData.map(item => {
                if(item._id === data._id){
                    newTableData.push(data)
                }else{
                    tableData.push(item)
                }
            })
            this.allTableData = newTableData
            this.setState({tableData: newTableData, showSuccessPopup: true, isSuccess: true})

        }).catch(err=>{
            this.setState({showSuccessPopup: true, isSuccess: false})
        })
    }
    render() {
        const {tableData, showCmrFormPopup, formData, isSuccess, showSuccessPopup} = this.state
        return (
            <div className={styles.container}>
                <div className={styles.tabelWrapper}>
                    <TableComp
                        data={tableData}
                        columns={this.columns} />
                </div>
                {showCmrFormPopup && 
                <CmrFormPopup 
                    formData={formData}
                    handleClose={()=>this.setState({showCmrFormPopup: false})}
                    handleSubmit={this.handleSubmit} />}
                {showSuccessPopup && 
                    <SuccessPopup
                    isSuccess={isSuccess}
                    successText={'CMR updated successful'}
                    errorText={'Failed please try again'}
                    onClick={() => this.setState({ showSuccessPopup: false, isSuccess: true })}
                    />}
            </div>
        );
    }
}

export default CMR;