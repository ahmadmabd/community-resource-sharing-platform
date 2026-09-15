import { prisma } from "@/lib/prisma";
async function CategoryFilter() {
  const categories = await prisma.category.findMany();
  return (
    <select name="categoryId">
      {categories.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
}
export default CategoryFilter;
