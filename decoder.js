const XMLTOOLS = require('./xmltools.js');
const DECRYPTION_PRIV_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv2dBbJOcWZ1au
xMgZ38FS0+2tFYFHqLTk5wFI6dJ8o1VFFg/PXkR8NFpf89A3f/PTvSuhGlMyhkKd
k4m7ea/vyiIKIF6hTuSCmV4jeop8WtzY8UwgS8kkeolElxh0dbG7aDq+SBKHDUuJ
g+34KKA4EksWMXeBFpOo35I95jAMBsAvTBBJo2MXiRCo+IjOiR+DL0toexVn1PAW
67kfEIrlEiNlueCUOTSdvr4vjj74HeeTNHMIa16KlHB8Fk4lF3L/ys6yv6IXaU+F
BDvEdFprhmfTPqk3Zd5IpXTDdaZWF3t9TfOgbO9l0zI0uCd72D/Ar6h3yGI5Oc1z
ydFRHpXxAgMBAAECggEAJkE7G2jWwL/wUorKgR51HwCtltazzhP8bkN2uxbqzGR3
21SmUdVPDroQ4wjWRgyWzXw8ropciQQ+H6uF7fvV81NEvnE2RN81xNd6bDtvPwhB
PQyZI/l4o2/oxrwb/NHRvVQ6W0SwiyKwSRUjQrYLzMbmAMj4F2QC8VzZoo+d6i99
VKXvVJ1mrYt3a2gzdkBPgjAhO6dDImgKJYPYI8xkjNWntGd8k58vSd06dX77Aa+b
ycHTyUlj7eVjsAREvFj6blaH2W2mV4I8axAiB1GUsDx2habZ6tYqHMOY3QByqd78
BfXzsM4Wsm1zevP2ARtM7mugG+t33MU4awol1kzB8QKBgQDfkn2Ir7VbJTv+YAtV
s0Ky8ZxU0Bc2gRjN0PiepIOvIXUSWDmDiNW1vhOCJ7tWRKGWi/gPjDy2yIR4/aS5
L2OxAO0ezaJ7jzMf9PxnIKVrf1/zCcv+LsKg//esyTr31jv+6zaS1dKTJP8pNUX2
tg2GOad9nAjHACVL0woAarzyZQKBgQDJW163rYZUUJFlHlwG6JI4mEKewgoTe5Hf
jnBDepgzUF4e7oYS5t7Iou6eLvpr28AFOqIVCGqI9U2nRto3almfR+BJkF6/jRFA
XTkQiIWng63QRWj6w69Oin49eKuhp7VQWIZH+v+kRA7Fa/uSxpgteZc7Z3RWm8Pq
gTnm1ZBWnQKBgQCiekeY6nkWQD0VZJ9YLOqwOT6vtHrqNW/dQ50rTcwVnm8CYfOK
UAtgBT8QO+e9jisQybABPJ1zCM6dT1hC7Nm6bT3mQPNwcGVrOBOmrucI9Iy6h8gk
db8kWmGYxLWCH8OCQ1Zp59Mc9KorPHgYD75MaeH7O0Z1uPlh3YFLREcEsQKBgDvi
a7oO5ot+5q7/J3l6g7pHNlEG/n4q2wh00ViQRmHEfimO4NsQRKPBKVxsNlgLpAEq
HfhJZ33SDsU4IkAm5f6kHsViJXuslbvhvc33/GAEnpX5fq5Nsn6WW9MmZ00NlrQN
j+oqcQtGnmoConBVlf64Ucz+CLCVZOACjNjlHSdVAoGAHORPfMu7avuv0RIyqYxw
6MaXLonnwzCZ/2kF3etZpTtZIi1TXoyLt+wW0jcoS6KD3+awjgwfWuPjz5RBpaA3
TkgGT/waSkZAfo1LhRn95nkxrySvW9C+eqtVeczpLojwuSTMELO5uuV1ku9z1JI9
RG/8XAscTcrSYqfBeYXWtnU=
-----END PRIVATE KEY-----
`;

const  decrypt = async (ev) => {

    console.log('xxx');
    const encrpytedXml = document.querySelector('#encrpytedXml').value;
    console.log(encrpytedXml);

    const decryptedDoc = await XMLTOOLS.decryptXml(encrpytedXml, DECRYPTION_PRIV_KEY);
    console.log('### decryptedDoc:', decryptedDoc);

    document.querySelector('#decodedText').textContent = encrpytedXml;

}

document.querySelector('#submitButton').addEventListener('click', decrypt);

