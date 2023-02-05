import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ClientVpnRouteTarget, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';

export class CdeskStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'TheVPC', {
     cidr: "10.0.0.0/16"
    })

    const securityGroup = new SecurityGroup(this, 'SecurityGroup1', { vpc });

    const endpoint = vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.2.0.0/16',
      serverCertificateArn: 'arn:aws:acm:us-east-1:510943636265:certificate/39c55431-2deb-478f-8928-a09eb7d8185d',
      clientCertificateArn: 'arn:aws:acm:us-east-1:510943636265:certificate/1efa00fe-8315-42ed-94fe-b55cd1486193',
      securityGroups: [securityGroup],
    });

    const publicSubnet = vpc.publicSubnets[0]

    endpoint.addAuthorizationRule('Rule', {
      cidr: publicSubnet.ipv4CidrBlock,
    });

    endpoint.addRoute('Route', {
      cidr: '0.0.0.0/0',
      target: publicSubnet,
    });
  }
}
