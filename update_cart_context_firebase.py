import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Add firebase imports at the top
import_statement = """import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, ordersCollection, productsCollection, notificationsCollection } from '../lib/firebase';
import { onSnapshot, setDoc, deleteDoc, doc, updateDoc, collection } from 'firebase/firestore';"""

content = content.replace("import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';", import_statement)

# Remove the getStoredProducts, getStoredOrders logic
content = re.sub(r'const getStoredProducts = \(\): Product\[\] => \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const getStoredOrders = \(\): Order\[\] => \{.*?\};\n', '', content, flags=re.DOTALL)

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
