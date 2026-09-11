import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { PRODUCTS, CATEGORIES } from '../data';

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed Categories
    CATEGORIES.forEach((cat) => {
      const catRef = doc(collection(db, 'categories'), cat.id);
      batch.set(catRef, {
        name: cat.name,
        icon: cat.icon
      });
    });

    // Seed Products
    PRODUCTS.forEach((prod) => {
      const prodRef = doc(collection(db, 'products'), prod.id);
      batch.set(prodRef, {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        image: prod.image,
        category: prod.category,
        available: prod.available,
        badge: prod.badge || null,
        badgeType: prod.badgeType || 'none'
      });
    });

    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}
