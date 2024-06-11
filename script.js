document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const interest = parseFloat(document.getElementById('interest').value);
    const interestType = document.getElementById('interest-type').value;
    const periods = parseInt(document.getElementById('periods').value);
    const calculationType = document.getElementById('calculation-type').value;

    // Verifica si los valores son válidos
    if (isNaN(amount) || isNaN(interest) || isNaN(periods) || amount <= 0 || interest <= 0 || periods <= 0) {
        alert('Por favor, introduce valores válidos.');
        return;
    }

    let rate;
    let totalPayments = periods;

    // Determina el interés según el tipo de interés
    switch (interestType) {
        case 'weekly':
            rate = interest / 100;
            break;
        case 'monthly':
            rate = interest / 100;
            break;
        case 'yearly':
            rate = interest / 100;
            break;
        default:
            rate = interest / 100;
    }

    if (calculationType === 'simple') {
        // Calcula el interés total usando interés simple
        const totalInterest = amount * rate * totalPayments;
        const totalAmount = amount + totalInterest;
        const payment = totalAmount / totalPayments;

        if (isFinite(payment)) {
            // Muestra los resultados
            document.getElementById('period-payment').textContent = payment.toFixed(2);
            document.getElementById('total-payment').textContent = totalAmount.toFixed(2);
            document.getElementById('total-interest').textContent = totalInterest.toFixed(2);

            // Genera el desglose de pagos
            generateSimpleInterestSchedule(amount, rate, totalPayments, payment);
            document.getElementById('results').classList.remove('hidden');
        } else {
            alert('Por favor, verifica los números ingresados');
        }
    } else if (calculationType === 'compound') {
        // Calcula el pago por periodo usando la fórmula del interés compuesto
        let payment;
        switch (interestType) {
            case 'weekly':
                payment = calculateCompoundPayment(amount, rate / 52, totalPayments);
                break;
            case 'monthly':
                payment = calculateCompoundPayment(amount, rate / 12, totalPayments);
                break;
            case 'yearly':
                payment = calculateCompoundPayment(amount, rate, totalPayments);
                break;
            default:
                payment = calculateCompoundPayment(amount, rate / 12, totalPayments);
        }

        if (isFinite(payment)) {
            // Muestra los resultados
            document.getElementById('period-payment').textContent = payment.toFixed(2);
            document.getElementById('total-payment').textContent = (payment * totalPayments).toFixed(2);
            document.getElementById('total-interest').textContent = ((payment * totalPayments) - amount).toFixed(2);

            // Genera el desglose de pagos
            generateCompoundInterestSchedule(amount, rate, totalPayments, payment, interestType);
            document.getElementById('results').classList.remove('hidden');
        } else {
            alert('Por favor, verifica los números ingresados');
        }
    }
});

function calculateCompoundPayment(principal, rate, totalPayments) {
    const x = Math.pow(1 + rate, totalPayments);
    return (principal * rate * x) / (x - 1);
}

function generateSimpleInterestSchedule(principal, interestRate, totalPayments, payment) {
    const paymentSchedule = document.getElementById('payment-schedule').querySelector('tbody');
    paymentSchedule.innerHTML = '';

    let balance = principal;
    const interestPayment = principal * interestRate;

    for (let i = 1; i <= totalPayments; i++) {
        const principalPayment = payment - interestPayment;
        balance -= principalPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${payment.toFixed(2)}</td>
            <td>${principalPayment.toFixed(2)}</td>
            <td>${interestPayment.toFixed(2)}</td>
            <td>${balance.toFixed(2)}</td>
        `;
        paymentSchedule.appendChild(row);

        // Corrige cualquier problema de precisión que pueda hacer que el balance sea negativo
        if (balance < 0) balance = 0;
    }
}

function generateCompoundInterestSchedule(principal, annualRate, totalPayments, payment, interestType) {
    const paymentSchedule = document.getElementById('payment-schedule').querySelector('tbody');
    paymentSchedule.innerHTML = '';

    let balance = principal;
    let rate;

    switch (interestType) {
        case 'weekly':
            rate = annualRate / 52;
            break;
        case 'monthly':
            rate = annualRate / 12;
            break;
        case 'yearly':
            rate = annualRate;
            break;
        default:
            rate = annualRate / 12;
    }

    for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = balance * rate;
        const principalPayment = payment - interestPayment;
        balance -= principalPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${payment.toFixed(2)}</td>
            <td>${principalPayment.toFixed(2)}</td>
            <td>${interestPayment.toFixed(2)}</td>
            <td>${balance.toFixed(2)}</td>
        `;
        paymentSchedule.appendChild(row);

        // Corrige cualquier problema de precisión que pueda hacer que el balance sea negativo
        if (balance < 0) balance = 0;
    }
}
