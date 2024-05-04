import React, { Component } from "react";
import Button from "../Button";
import Input from "../Input";
import Textarea from "../Textarea";
import styles from "./styles.module.css";

class CmrFormPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      orderId:'',
      senderName: "",
      senderAddress: "",
      senderCountry: "",
      receiverName: "",
      receiverAddress: "",
      receiverCountry: "",
      marksAndNos: "",
      numberOfParcel: "",
      methodOfPacking: "",
      natureOfGoods: "",
      statisticalNr: "",
      grossWeight: "",
      volume: "",
      senderInstructions: "",
      cashOnDelivery: false,
      
    };
    this.cashOnDeliveryList = [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ];
  }
  componentDidMount() {
    this.setFormState(this.props.formData);
  }
  setFormState = (data) => {
    const { _id, orderId, senderName, senderAddress, senderCountry, receiverName, receiverAddress, receiverCountry, numberOfParcel, grossWeight, volume, senderInstructions, marksAndNos, natureOfGoods,statisticalNr,cashOnDelivery, methodOfPacking } = data;
    this.setState({
      id: _id,
      orderId,
      senderName,
      senderAddress,
      senderCountry,
      receiverName,
      receiverAddress,
      receiverCountry,
      numberOfParcel,
      grossWeight,
      volume,
      senderInstructions,
      marksAndNos,
      natureOfGoods,
      statisticalNr,
      cashOnDelivery,
      methodOfPacking
    });
  };
  handleValidation=()=>{
    const {marksAndNos, methodOfPacking, natureOfGoods, statisticalNr, cashOnDelivery, senderInstructions} = this.state
    const validationList = [
      {}
    ]
      return true
  }
  render() {
    const {
      id,
      orderId,
      senderName,
      senderAddress,
      senderCountry,
      receiverName,
      receiverAddress,
      receiverCountry,
      marksAndNos,
      numberOfParcel,
      methodOfPacking,
      natureOfGoods,
      statisticalNr,
      grossWeight,
      volume,
      senderInstructions,
      cashOnDelivery,
    } = this.state;
    
    const { disableCutomerEdit, handleClose, handleSubmit } = this.props;
    return (
      <div className={styles.mainContainer}>
        <div className={styles.bodayContainer}>
          <div className={styles.heading}>CMR Form : {orderId}</div>
          <div className={styles.bodaySubContainer} id={"cmrFormPopup"}>
            <Input
              disable
              id={"senderName"}
              label={"Sender name"}
              value={senderName}
              className={styles.disabledInput}
            />
            <div
              style={{ gridRow: "1 / 3", gridColumn: "2 / 3" }}
              className={styles.disabledInput}
            >
              <label>Sender Address</label>
              <Textarea rows={4} value={senderAddress} disabled={true} />
            </div>
            <Input
              disable
              id={"senderCountry"}
              label={"Sender country"}
              value={senderCountry && senderCountry.label}
              className={styles.disabledInput}
            />
            <Input
              disable
              id={"receiverName"}
              label={"Reciever name"}
              value={receiverName}
              className={styles.disabledInput}
            />
            <div
              style={{ gridRow: "3 / 5", gridColumn: "2 / 3" }}
              className={styles.disabledInput}
            >
              <label>Receiver address</label>
              <Textarea rows={4} value={receiverAddress} />
            </div>
            <Input
              disable
              id={"receiverCountry"}
              label={"Reciever country"}
              value={receiverCountry && receiverCountry.label}
              className={styles.disabledInput}
            />
            <Input
              disable
              id={"numberOfParcel"}
              label={"Number of parcel"}
              value={numberOfParcel}
              className={styles.disabledInput}
            />
            <Input
              disable
              id={"grossWeight"}
              label={"Gross weight"}
              value={grossWeight}
              className={styles.disabledInput}
            />
            <Input
              disable
              id={"volume"}
              label={"Volume"}
              value={volume}
              className={styles.disabledInput}
            />
            <Input
              id={"marksAndNos"}
              label={"Marks and Nos"}
              value={marksAndNos}
              onChange={(e, val)=>this.setState({marksAndNos: val})}
            />
            <Input
              id={"methodOfPacking"}
              label={"Method of packing"}
              value={methodOfPacking}
              onChange={(e, val)=>this.setState({methodOfPacking: val})}
            />
            <Input
              id={"natureOfGoods"}
              label={"Nature of goods"}
              value={natureOfGoods}
              onChange={(e, val)=>this.setState({natureOfGoods: val})}
            />
            <Input
              id={"statisticalNr"}
              label={"Statistical Nr"}
              value={statisticalNr}
              onChange={(e, val)=>this.setState({statisticalNr: val})}
            />

            <div className={styles.cashOnDelivery}>
              <div>Cash on delivery</div>
              {this.cashOnDeliveryList &&
                this.cashOnDeliveryList.map((item, i) => {
                  return (
                    <span key={i}>
                      <input
                        type={"radio"}
                        name={"receiverRadio"}
                        value={item.label}
                        checked={item.value === cashOnDelivery}
                        onChange={() =>
                          this.setState({ cashOnDelivery: item.value })
                        }
                      />
                      {item.label}
                    </span>
                  );
                })}
            </div>
            <div style={{ gridRow: "9 / 11", gridColumn: "1 / 2" }}>
              <label>Sender instruction</label>
              <Textarea rows={4} 
                value={senderInstructions}
                onChange={(e, val)=>this.setState({senderInstructions: val})} />
            </div>
          </div>
          <div className={styles.btnContainer}>
            <Button
              text={"Close"}
              classes={"secondary"}
              onClick={handleClose}
            />
            {!disableCutomerEdit && (
              <Button
                text={"Submit"}
                classes={"primary"}
                onClick={() => {
                  if (this.handleValidation()) 
                    handleSubmit(id, {orderId, senderName, senderAddress, senderCountry, receiverName, receiverAddress, receiverCountry, marksAndNos, numberOfParcel, methodOfPacking, natureOfGoods, statisticalNr, grossWeight, volume, senderInstructions, cashOnDelivery,});
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CmrFormPopup;
