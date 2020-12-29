# arlo-command-line

A command line tool to quickly turn on+arm or turn off+disarm Arlo
cameras, e.g. to use on a Raspberry Pi with Smart Home environments. Can
be invoked via ssh. Tested with Arlo Q cams.

If you'd like to call this script via ssh (e.g. via a smart home device
like Homey), create an own user and add the following to
`.ssh/authorized_keys`:

```
command="ARLO_USERNAME=CHANGE_TO@MY-EMAIL.com; export ARLO_B64PASSWORD=0123456789ABCDEF; export ARLO_MFA_URL=https://ABCDEF.execute-api.eu-central-1.amazonaws.com/default/retrieveLatestSMS; export ARLO_MFA_API_KEY=ABCDEF; arlo-command-line/arlo-cl.py ${SSH_ORIGINAL_COMMAND}",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-rsa _YOUR_SSH_KEY_HERE_
```

To enable multi factor auth, you need to set up on AWS:
- A Pinpoint project twoFactorAuth to receive SMS (long code, two-way SMS)
- A SNS topic twoFactorAuth receiving the incoming SMS
- A DynamoDB table twoFactorAuth (Primary partition key: message_type (string), Primary sort key: message_timestanp (number), TTL key: record_expires_at)
- A lambda functions twoFactorAuth to push incoming SMS via SNS to DynamoDB
- A lambda function retrieveLatestSMS to retrieve the latest SMS
- An incoming API Gateway connecting to retrieveLatestSMS as REST (proteced by API Key in the Header)
- IAM roles for the dynamoDB functions allowing full access to the
  DynamoDB table twoFactorAuth and full access to the SNS topic twoFactorAuth 

The code is based on:
Arlo Python library (https://github.com/jeffreydwalter/arlo),
arlo-cl (https://github.com/m0urs/arlo-cl) and
arlo-mfa-aws (https://github.com/twratl/arlo-mfa-aws)

## Usage:

```text
usage: arlo-cl.py {list,arm,disarm}
```

## Samples:

### List all known devices:

```text
arlo-cl.py list-devices
```
Output:

```text
<DEVICENAME>  :  <DEVICETYPE>  :  <FULL SNAPSHOT URL>
```

### Activate and arm all cameras

```text
arlo-cl.py arm
```

### Deactivate and disarm all cameras

```text
arlo-cl.py arm
```
