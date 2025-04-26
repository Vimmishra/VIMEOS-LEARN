import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { captureAndFinalizePaymentService } from '@/services';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaypalPaymentReturnPage = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    useEffect(() => {

        if (payerId && paymentId) {
            async function capturePayment() {
                const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

                const response = await captureAndFinalizePaymentService(
                    paymentId, payerId,
                    orderId,
                )


                if (response.success) {
                    sessionStorage.removeItem('currentOrderId');
                    window.location.href = "/student-courses"
                }

            }
            capturePayment()
        }

    }, [paymentId, payerId])

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Processing payment... Please wait for a while!</CardTitle>
                </CardHeader>

            </Card>

        </div>
    )
}

export default PaypalPaymentReturnPage