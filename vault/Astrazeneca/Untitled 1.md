From an architecture perspective, using an AWS Route53 Resolver rule to forward DNS resolution for Azure private endpoints to the corresponding Azure DNS servers, and associating it with the relevant VPC, is a valid and established cross-cloud pattern. This is appropriate where AWS workloads need to resolve Azure services exposed via private endpoints.

A few important conditions to note:

This applies only to workloads running inside a VPC associated with the resolver rule; it will not address components outside that scope.

The rule should be domain-specific and tightly scoped.

Standard change and approval processes (including AWS Account Owner approval) should be followed.

The dependency on cross-cloud private DNS resolution should be documented (e.g. Architecture Note or ADR).

Provided these conditions are met, I don’t see architectural concerns with proceeding using this approach.

Thanks,
Laura