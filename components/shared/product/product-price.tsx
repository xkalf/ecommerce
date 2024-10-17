import { cn } from "@/lib/utils";

const ProductPrice = ({
	value,
	className,
}: {
	value: number;
	className?: string;
}) => {
	return (
		<p className={cn("text-sm", className)}>
			{Intl.NumberFormat("mn").format(value)}₮
		</p>
	);
};

export default ProductPrice;
