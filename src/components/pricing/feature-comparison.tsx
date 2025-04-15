import { Check, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const features = [
  {
    name: "Opportunity Posting",
    payPerPost: "1 post",
    unlimited: "Unlimited",
  },
  {
    name: "Listing Duration",
    payPerPost: "30 days",
    unlimited: "Unlimited",
  },
  {
    name: "Brand Profile",
    payPerPost: true,
    unlimited: true,
  },
  {
    name: "Application Tracking",
    payPerPost: true,
    unlimited: true,
  },
  {
    name: "Dedicated Support",
    payPerPost: false,
    unlimited: true,
  },
  {
    name: "API Access",
    payPerPost: false,
    unlimited: true,
  },
  {
    name: "Custom Branding",
    payPerPost: false,
    unlimited: true,
  },
];

export function FeatureComparison() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Feature</TableHead>
            <TableHead>Pay Per Post</TableHead>
            <TableHead>Unlimited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.name}>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell>
                {typeof feature.payPerPost === "boolean" ? (
                  feature.payPerPost ? (
                    <Check className="h-5 w-5 text-brand-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )
                ) : (
                  feature.payPerPost
                )}
              </TableCell>
              <TableCell>
                {typeof feature.unlimited === "boolean" ? (
                  feature.unlimited ? (
                    <Check className="h-5 w-5 text-brand-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )
                ) : (
                  feature.unlimited
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}