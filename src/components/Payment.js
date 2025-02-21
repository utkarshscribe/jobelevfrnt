import React, { useState } from "react";
import axios from "axios";
import { Container, Card, CardBody, CardTitle, FormGroup, Label, Input, Button } from "reactstrap";

const Payment = () => {
    const [profileType, setProfileType] = useState("user");
    const [amount, setAmount] = useState(300);
    
    const loadRazorpayScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

    const authToken = localStorage.getItem("authToken");
    const handlePayment = async () => {
        const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
          }
        try {
            const { data: order } = await axios.post(
                "https://jobapi.crmpannel.site/auth/v1/pay", 
                {
                  amount
                },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`
                  }
                
                }
              );
        console.log( localStorage.getItem("authToken"));      
     console.log( order);
            const options = {
                key: "your_razorpay_key_id",
                amount: order.amount,
                currency: order.currency,
                name: "Your Company",
                description: "Secure Online Payment",
                order_id: order.id,
                handler: async function (response) {
                    const verifyResponse = await axios.post("https://jobapi.crmpannel.site/auth/v1/verify-pay", {
                        RAZORPAY_KEY_ID:"rzp_test_33IoIdjYWhJxb8",
                        RAZORPAY_KEY_SECRET:"wJGkODzUJ7sm9ehDtkxkUvl4",
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyResponse.data.success) {
                        alert("Payment Successful!");
                    } else {
                        alert("Payment Failed!");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#007bff"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="shadow-lg border-0" style={{ width: "450px", borderRadius: "12px" }}>
                <CardBody>
                    <CardTitle tag="h3" className="text-center mb-4 text-primary">Payment Options</CardTitle>
                    <FormGroup>
                        <Label for="profileType" className="fw-bold">Select Plan</Label>
                        <Input 
                            type="select" 
                            id="profileType" 
                            value={profileType} 
                            onChange={(e) => setProfileType(e.target.value)}
                            className="form-select"
                        >
                            <option value="user">User Plan - ₹149 + GST</option>
                            <option value="employer">Employer Recharge</option>
                        </Input>
                    </FormGroup>
                    {profileType === "employer" && (
                        <FormGroup>
                            <Label for="amount" className="fw-bold">Enter Amount</Label>
                            <Input 
                                type="number" 
                                id="amount" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                min={300} 
                                className="form-control"
                            />
                        </FormGroup>
                    )}
                    <Button color="primary" block className="mt-3 py-2 fw-bold" onClick={handlePayment}>
                        Proceed to Pay
                    </Button>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Payment;
