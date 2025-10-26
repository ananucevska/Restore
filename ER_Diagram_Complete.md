# Entity Relationship Diagram - Diplomska Project

```mermaid
erDiagram
    User {
        string Id PK
        string UserName
        string Email
        string City
        string Name
        string Municipality
        string Neighborhood
        string PasswordHash
        string SecurityStamp
        string ConcurrencyStamp
        boolean EmailConfirmed
        boolean PhoneNumberConfirmed
        boolean TwoFactorEnabled
        boolean LockoutEnabled
        datetime LockoutEnd
        int AccessFailedCount
        string PhoneNumber
        string NormalizedEmail
        string NormalizedUserName
    }
    
    Product {
        int Id PK
        string Name
        string Description
        string PictureUrl
        string Type
        string PublicId
        string UserId FK
        datetime CreatedDate
        boolean CargoDelivery
        string Condition
        string Delivery
    }
    
    ProductImage {
        int Id PK
        string Url
        string PublicId
        int ProductId FK
        int Order
    }
    
    
    Save {
        int Id PK
        string UserId FK
        int ProductId FK
        datetime SavedDate
    }
    
    Conversation {
        int Id PK
        string User1Id FK
        string User2Id FK
        int ProductId FK
        datetime CreatedAt
        datetime LastMessageAt
    }
    
    Message {
        int Id PK
        int ConversationId FK
        string SenderId FK
        string Content
        datetime SentAt
        boolean IsRead
    }
    
    IdentityRole {
        string Id PK
        string Name
        string NormalizedName
        string ConcurrencyStamp
    }
    
    IdentityUserRole {
        string UserId FK
        string RoleId FK
    }
    
    %% Core Application Relationships
    User ||--o{ Product : "owns"
    User ||--o{ Save : "saves"
    User ||--o{ Conversation : "participates_as_user1"
    User ||--o{ Conversation : "participates_as_user2"
    User ||--o{ Message : "sends"
    
    Product ||--o{ ProductImage : "has"
    Product ||--o{ Save : "saved_by"
    Product ||--o{ Conversation : "discussed_in"
    
    Conversation ||--o{ Message : "contains"
    
    %% ASP.NET Identity Relationships
    User ||--o{ IdentityUserRole : "has_roles"
    IdentityRole ||--o{ IdentityUserRole : "assigned_to_users"
```

## 📊 **How to Use This ER Diagram**

### **1. Viewing the Diagram**

**Option A: GitHub/GitLab (Recommended)**
- Copy the entire content above
- Paste it into a `.md` file in your repository
- GitHub and GitLab will automatically render the Mermaid diagram

**Option B: VS Code**
- Install the "Mermaid Preview" extension
- Open the `.md` file and use `Ctrl+Shift+P` → "Mermaid Preview"

**Option C: Online Mermaid Editor**
- Go to [mermaid.live](https://mermaid.live)
- Paste the mermaid code (everything between the ```mermaid tags)
- View and export the diagram

### **2. Understanding the Diagram**

#### **Entity Types:**
- **Rectangles** = Tables/Entities
- **Fields** = Columns in each table
- **PK** = Primary Key
- **FK** = Foreign Key

#### **Relationship Types:**
- **||--o{** = One-to-Many (1 user owns many products)
- **||--||** = One-to-One (1 order has 1 shipping address)
- **o{--o{** = Many-to-Many (users can save many products)

### **3. Key Relationships Explained**

#### **User-Centric Relationships:**
```
User → Products (1:Many)     - Users can own multiple products
User → Saves (1:Many)       - Users can save multiple products  
User → Conversations (1:Many) - Users participate in multiple conversations
User → Messages (1:Many)    - Users can send multiple messages
```

#### **Product-Centric Relationships:**
```
Product → ProductImages (1:Many) - Products can have multiple images
Product → Saves (1:Many)         - Products can be saved by multiple users
Product → Conversations (1:Many)  - Products can have multiple conversations
```

#### **Messaging System:**
```
Conversation → Messages (1:Many) - Conversations contain multiple messages
Conversation → User1 (Many:1)    - Conversations have a first user
Conversation → User2 (Many:1)    - Conversations have a second user
```

### **4. Database Design Insights**

#### **Marketplace Model:**
- **No Shopping Cart** - Users don't add items to baskets
- **Direct Communication** - Buyers contact sellers via messaging
- **Save/Wishlist** - Users can save products they're interested in
- **No Order System** - Transactions handled outside the application

#### **ASP.NET Identity Integration:**
- **User Management** - Built-in authentication and authorization
- **Role-Based Access** - Users have "Member" role
- **Security Features** - Password hashing, lockout, two-factor auth support

### **5. Using for Development**

#### **Adding New Features:**
1. **Identify affected entities** from the diagram
2. **Check relationships** to understand data flow
3. **Plan migrations** based on schema changes
4. **Update controllers** to handle new relationships

#### **Database Optimization:**
1. **Index foreign keys** (UserId, ProductId, ConversationId)
2. **Consider denormalization** for frequently accessed data
3. **Plan for scaling** based on relationship patterns

#### **API Design:**
1. **Follow entity relationships** in your API endpoints
2. **Include related data** using Entity Framework's Include()
3. **Respect data boundaries** based on ownership relationships

### **6. Maintenance**

#### **Keep Updated:**
- **Update diagram** when adding new entities
- **Document changes** in migration comments
- **Review relationships** during code reviews
- **Validate constraints** match diagram relationships

This ER diagram serves as your **database blueprint** and should be referenced whenever you're working with data relationships in your application! 🎯
