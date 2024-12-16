import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { deleteProduct } from "@/lib/api";

export default function Products() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        description: "Product deleted successfully",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      deleteMutation.mutate(selectedProductId);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Productos de Bienestar y Salud</h1>
        <Link href="/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-xl font-semibold">{product.name}</span>
                <span className="text-lg font-medium text-green-600">
                  ${product.price}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover rounded-md w-full h-48"
                />
              </div>
              <p className="text-gray-600 line-clamp-2">{product.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Inventario: <span className="text-blue-600">{product.stock} unidades</span>
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    Categoría: <span className="text-blue-600">{product.category}</span>
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-1 bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min((Number(product.stock) / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/products/${product.id}/edit`}>
                <Button variant="outline" size="icon" className="hover:border-blue-600 hover:text-blue-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(product.id)}
                className="hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro de que quieres eliminar este producto?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="hover:bg-gray-100">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="hover:bg-red-700">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
