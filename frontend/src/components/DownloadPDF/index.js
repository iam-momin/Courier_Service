import { PDFDownloadLink } from "@react-pdf/renderer";
const DownloadPDF = ({handleFunction, document, data, fileName}) =>{
    return <PDFDownloadLink id={'Hi'} document={document} fileName={data.orderId + fileName}>
    {handleFunction}
</PDFDownloadLink>
}

export default DownloadPDF;