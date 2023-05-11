## This checks if the certificate matching a priate key
CERTIFICATE=$1
PRIVATE_KEY=$2
echo $CERTIFICATE $PRIVATE_KEY 

CERT_MD5=`openssl x509 -noout -modulus -in $CERTIFICATE  | openssl md5`
PRIV_MD5=`openssl rsa -noout -modulus -in $PRIVATE_KEY | openssl md5`

echo Certificate MD5 $CERT_MD5
echo Certificate MD5 $PRIV_MD5

if [ "$CERT_MD5" = "$PRIV_MD5" ]
then
    echo "Key MD match :)))"
else
    echo Key MD NO MATCH !!!!!
fi


