export const awsSnsNotificationForSes = [
    {
        "eventType": "Reject",
        "mail": {
            "timestamp": "2026-03-27T09:54:28.107Z",
            "source": "noreply@atsubmit.com",
            "sourceArn": "arn:aws:ses:us-east-1:486431272817:identity/atsubmit.com",
            "sendingAccountId": "486431272817",
            "messageId": "0100019d2eb7748b-7b357ab2-d2c1-4605-9575-ca8cb6bcf2cf-000000",
            "destination": [
                "nguyenhy311@gmail.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@atsubmit.com"
                },
                {
                    "name": "To",
                    "value": "nguyenhy311@gmail.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/mixed;  boundary=\"----=_Part_62004_599376455.1774605268107\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@atsubmit.com"
                ],
                "to": [
                    "nguyenhy311@gmail.com"
                ],
                "messageId": "0100019d2eb7748b-7b357ab2-d2c1-4605-9575-ca8cb6bcf2cf-000000",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "my-first-configuration-set"
                ],
                "ses:source-ip": [
                    "115.77.252.76"
                ],
                "ses:from-domain": [
                    "atsubmit.com"
                ],
                "ses:caller-identity": [
                    "iam_mrsay132"
                ]
            }
        },
        "reject": {
            "reason": "Bad content"
        }
    },
    {
        "eventType": "Bounce",
        "bounce": {
            "feedbackId": "<feedbackId>",
            "bounceType": "Permanent",
            "bounceSubType": "General",
            "bouncedRecipients": [
                {
                    "emailAddress": "suppressionlist@simulator.amazonses.com",
                    "action": "failed",
                    "status": "5.1.1",
                    "diagnosticCode": "smtp; 550 5.1.1 As requested: user unknown (suppressed address: suppressionlist@simulator.amazonses.com)"
                }
            ],
            "timestamp": "2026-03-26T02:13:35.912Z",
            "remoteMtaIp": "<ip-v4>",
            "reportingMTA": "dns; a48-89.smtp-out.amazonses.com"
        },
        "mail": {
            "timestamp": "2026-03-26T02:13:35.500Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "suppressionlist@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "suppressionlist@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_611642_1659316433.1774491215500\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "suppressionlist@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        }
    },
    {
        "eventType": "Send",
        "mail": {
            "timestamp": "2026-03-26T02:13:35.500Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "suppressionlist@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "suppressionlist@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_611642_1659316433.1774491215500\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "suppressionlist@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        },
        "send": {}
    },
    {
        "eventType": "Complaint",
        "complaint": {
            "feedbackId": "<feedbackId>",
            "complaintSubType": null,
            "complainedRecipients": [
                {
                    "emailAddress": "complaint@simulator.amazonses.com"
                }
            ],
            "timestamp": "2026-03-26T02:13:22.240Z",
            "userAgent": "Amazon SES Mailbox Simulator",
            "complaintFeedbackType": "abuse",
            "arrivalDate": "2026-03-26T02:13:22.240Z"
        },
        "mail": {
            "timestamp": "2026-03-26T02:13:21.662Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "complaint@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "complaint@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_555787_888306709.1774491201662\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "complaint@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        }
    },
    {
        "eventType": "Delivery",
        "mail": {
            "timestamp": "2026-03-26T02:13:21.662Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "complaint@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "complaint@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_555787_888306709.1774491201662\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "complaint@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:outgoing-tls-version": [
                    "TLSv1.3"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ],
                "ses:outgoing-ip": [
                    "54.240.48.102"
                ]
            }
        },
        "delivery": {
            "timestamp": "2026-03-26T02:13:22.263Z",
            "processingTimeMillis": 601,
            "recipients": [
                "complaint@simulator.amazonses.com"
            ],
            "smtpResponse": "250 Ok",
            "remoteMtaIp": "<ip-v4>",
            "reportingMTA": "a48-102.smtp-out.amazonses.com"
        }
    },
    {
        "eventType": "Send",
        "mail": {
            "timestamp": "2026-03-26T02:13:21.662Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "complaint@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "complaint@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_555787_888306709.1774491201662\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "complaint@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        },
        "send": {}
    },
    {
        "eventType": "Bounce",
        "bounce": {
            "feedbackId": "<feedbackId>",
            "bounceType": "Transient",
            "bounceSubType": "General",
            "bouncedRecipients": [
                {
                    "emailAddress": "ooto@simulator.amazonses.com"
                }
            ],
            "timestamp": "2026-03-26T02:13:09.437Z"
        },
        "mail": {
            "timestamp": "2026-03-26T02:13:08.926Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "ooto@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "ooto@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_641673_1273768381.1774491188926\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "ooto@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        }
    },
    {
        "eventType": "Delivery",
        "mail": {
            "timestamp": "2026-03-26T02:13:08.926Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "ooto@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "ooto@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_641673_1273768381.1774491188926\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "ooto@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:outgoing-tls-version": [
                    "TLSv1.3"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ],
                "ses:outgoing-ip": [
                    "54.240.8.86"
                ]
            }
        },
        "delivery": {
            "timestamp": "2026-03-26T02:13:09.460Z",
            "processingTimeMillis": 534,
            "recipients": [
                "ooto@simulator.amazonses.com"
            ],
            "smtpResponse": "250 Ok",
            "remoteMtaIp": "52.55.227.230",
            "reportingMTA": "a8-86.smtp-out.amazonses.com"
        }
    },
    {
        "eventType": "Send",
        "mail": {
            "timestamp": "2026-03-26T02:13:08.926Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "ooto@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "ooto@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_641673_1273768381.1774491188926\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "ooto@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        },
        "send": {}
    },
    {
        "eventType": "Bounce",
        "bounce": {
            "feedbackId": "<feedbackId>",
            "bounceType": "Permanent",
            "bounceSubType": "General",
            "bouncedRecipients": [
                {
                    "emailAddress": "bounce@simulator.amazonses.com",
                    "action": "failed",
                    "status": "5.1.1",
                    "diagnosticCode": "smtp; 550 5.1.1 As requested: user unknown <bounce@simulator.amazonses.com>"
                }
            ],
            "timestamp": "2026-03-26T02:02:55.303Z",
            "remoteMtaIp": "54.146.26.30",
            "reportingMTA": "dns; a8-86.smtp-out.amazonses.com"
        },
        "mail": {
            "timestamp": "2026-03-26T02:02:54.917Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "bounce@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "bounce@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_622105_676820028.1774490574917\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "bounce@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        }
    },
    {
        "eventType": "Send",
        "mail": {
            "timestamp": "2026-03-26T02:02:54.917Z",
            "source": "noreply@domain.com",
            "sourceArn": "arn:aws:ses:<aws-region-alias>:<aws-accountid>:identity/domain.com",
            "sendingAccountId": "<aws-accountid>",
            "messageId": "<message-id>",
            "destination": [
                "bounce@simulator.amazonses.com"
            ],
            "headersTruncated": false,
            "headers": [
                {
                    "name": "From",
                    "value": "noreply@domain.com"
                },
                {
                    "name": "To",
                    "value": "bounce@simulator.amazonses.com"
                },
                {
                    "name": "Subject",
                    "value": "Send Bounce Mail"
                },
                {
                    "name": "MIME-Version",
                    "value": "1.0"
                },
                {
                    "name": "Content-Type",
                    "value": "multipart/alternative;  boundary=\"----=_Part_622105_676820028.1774490574917\""
                }
            ],
            "commonHeaders": {
                "from": [
                    "noreply@domain.com"
                ],
                "to": [
                    "bounce@simulator.amazonses.com"
                ],
                "messageId": "<message-id>",
                "subject": "Send Bounce Mail"
            },
            "tags": {
                "ses:source-tls-version": [
                    "TLSv1.3"
                ],
                "ses:operation": [
                    "SendEmail"
                ],
                "ses:configuration-set": [
                    "aws-ses-configuration-set"
                ],
                "ses:source-ip": [
                    "<ip-v4>"
                ],
                "ses:from-domain": [
                    "domain.com"
                ],
                "ses:caller-identity": [
                    "aws_iam_caller_identity_username"
                ]
            }
        },
        "send": {}
    }
];
