import { prisma } from "@/lib/prisma";
async function ConditionsFilter() {
  const conditions = await prisma.resource.findMany();
  return (
    <select name="category" id="">
      {conditions.map((item) => (
        <option key={item.id}>{item.condition}</option>
      ))}
    </select>
  );
}
export default ConditionsFilter;
