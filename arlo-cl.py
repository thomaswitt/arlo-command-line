#!/usr/bin/env python3

from arlo import Arlo
import sys
import os
import errno
import argparse
import base64

try:
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['list', 'arm', 'disarm'])
    args = parser.parse_args()
    command=args.command

    # PW: str(base64.b64encode('YOUR_PASSWORD'.encode("utf-8")))
    USERNAME = os.environ['ARLO_USERNAME']
    PASSWORD = os.environ['ARLO_B64PASSWORD']
    MFA_URL = os.environ['ARLO_MFA_URL']
    MFA_API_KEY = os.environ['ARLO_MFA_API_KEY']

    # Instantiating the Arlo object automatically calls Login(),
    # which returns an oAuth token that gets cached.
    # Subsequent successful calls to login will update the oAuth token.
    print("Logging in", "… ", end='')
    arlo = Arlo(USERNAME, PASSWORD, MFA_URL, MFA_API_KEY)
    print("ok!")

    # Get all device objects
    devices = arlo.GetDevices()

    if command == 'list':
        for device in devices:
            if device['state'] == "provisioned":
                #print (device)
                #print (device['deviceName']," : ", device['deviceType']," : ", device['presignedLastImageUrl']," : ", device['presignedSnapshotUrl']," : ", device['presignedFullFrameSnapshotUrl'])
                print (device['deviceName']," - ", device['presignedFullFrameSnapshotUrl'])

    elif command == 'disarm':
        for device in devices:
            if device['state'] == "provisioned":
                print("Disarming", device['deviceName'], "… ", flush=True, end='')
                arlo.Disarm(device)
                print("Turning off … ", flush=True, end='')
                arlo.ToggleCamera(device, device, True)
                print("ok!")
                arlo.Logout()
                arlo = Arlo(USERNAME, PASSWORD, MFA_URL, MFA_API_KEY)

    elif command == 'arm':
        for device in devices:
            if device['state'] == "provisioned":
                print("Turning on", device['deviceName'], "… ", flush=True, end='')
                arlo.ToggleCamera(device, device, False)
                print("Arming … ", flush=True, end='')
                arlo.Arm(device)
                print("ok!")
                arlo.Logout()
                arlo = Arlo(USERNAME, PASSWORD, MFA_URL, MFA_API_KEY)

    else:
        sys.stderr.write("This should not happen")

except Exception as e:
    print(e)

print("Logging out", "…", flush=True, end='')
try:
    arlo.Logout()
except:
    pass
print("all done, exiting!")
