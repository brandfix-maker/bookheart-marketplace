# Gradient Background System - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. View the Demo
```bash
cd apps/web
npm run dev
# Visit: http://localhost:3000/examples/gradients
```

### 2. Choose Your Depth Level

**Subtle (5-10%)** - For readable content
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-extended-subtle-3" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

**Medium (15-25%)** - For balanced sections
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-extended-medium-5" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

**Bold (40-60%)** - For hero sections
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

### 3. Add Glass Effects

```tsx
{/* Light glass card */}
<div className="glass-light p-6 rounded-lg">
  Card content
</div>

{/* Frosted glass with color tint */}
<div className="glass-frosted-purple p-6 rounded-lg">
  Branded card
</div>
```

## 📋 Available Classes

### Gradients
- Hero: `bg-gradient-hero-{subtle|medium|bold}`
- Extended: `bg-gradient-extended-{subtle|medium|bold}-{1-7}`
- Sparkle: `bg-sparkle-{subtle|medium|bold}`

### Glass Effects  
- Basic: `glass-{light|medium|heavy}`
- Frosted: `glass-frosted-{pink|purple|blue}`
- Backdrop: `backdrop-blur-{subtle|md|lg|xl}`

### Helpers
- `bg-layer-container` - Container for layered backgrounds
- `bg-gradient-animated` - Animated gradient overlay

## 💡 Common Patterns

### Hero Section
```tsx
<section className="relative min-h-screen">
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  <div className="relative z-10">
    <h1 className="gradient-text">BookHeart</h1>
  </div>
</section>
```

### Feature Section
```tsx
<section className="relative py-20">
  <div className="absolute inset-0 bg-gradient-extended-medium-3" />
  <div className="relative z-10 grid grid-cols-3 gap-6">
    <div className="glass-medium p-6 rounded-lg">Feature 1</div>
    <div className="glass-medium p-6 rounded-lg">Feature 2</div>
    <div className="glass-medium p-6 rounded-lg">Feature 3</div>
  </div>
</section>
```

### Dashboard Card
```tsx
<div className="relative rounded-xl overflow-hidden">
  <div className="absolute inset-0 bg-gradient-extended-subtle-2" />
  <div className="relative glass-light p-6">
    Dashboard content
  </div>
</div>
```

### Layered Background
```tsx
<section className="relative">
  {/* Layer 1: Base */}
  <div className="absolute inset-0 bg-gradient-extended-medium-6" />
  
  {/* Layer 2: Animation */}
  <div className="absolute inset-0 bg-gradient-animated" />
  
  {/* Layer 3: Sparkle */}
  <div className="absolute inset-0 bg-sparkle-subtle" />
  
  {/* Content */}
  <div className="relative z-10 p-12">
    Your content here
  </div>
</section>
```

## 🎯 When to Use What

| Scenario | Recommended Class |
|----------|------------------|
| Hero/Landing | `bg-gradient-hero-bold` |
| Feature sections | `bg-gradient-extended-medium-{1-7}` |
| Dashboard | `bg-gradient-extended-subtle-{1-7}` |
| Cards | `glass-{light\|medium\|heavy}` |
| Modals | `glass-heavy` + `backdrop-blur-xl` |
| Branded elements | `glass-frosted-purple` |

## ⚡ Pro Tips

1. **Always use relative/absolute positioning**
   ```tsx
   <div className="relative">
     <div className="absolute inset-0 bg-gradient-..." />
     <div className="relative z-10">{/* Content */}</div>
   </div>
   ```

2. **Don't stack more than 3-4 layers** - Performance!

3. **Mobile automatically optimized** - No extra code needed!

4. **Dark mode works automatically** - Glass effects adapt!

5. **Combine with existing utilities**
   ```tsx
   <div className="glass-medium rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
   ```

## 📚 Full Documentation

For complete details, see:
- **GRADIENT_BACKGROUND_SYSTEM.md** - Full usage guide
- **GRADIENT_SYSTEM_IMPLEMENTATION_SUMMARY.md** - Technical details
- **/examples/gradients** - Live interactive demo

## ✨ Examples in Action

Replace your existing backgrounds with the new system:

### Before
```tsx
<div className="bg-purple-900/20">
  Content
</div>
```

### After
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-extended-medium-5" />
  <div className="relative z-10">
    Content
  </div>
</div>
```

## 🎨 Gradient Picker

Can't decide? Try different variants:
1. Start with `bg-gradient-extended-medium-3`
2. If too bold → Switch to `subtle-3`
3. If too subtle → Switch to `bold-3`
4. Try other numbers (1-7) for different colors

## 🔥 Ready-to-Copy Templates

### Template 1: Hero with Layers
```tsx
<section className="relative min-h-screen bg-layer-container">
  <div className="absolute inset-0 bg-gradient-hero-bold" />
  <div className="absolute inset-0 bg-sparkle-medium" />
  <div className="relative z-10 container mx-auto flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="gradient-text text-6xl font-bold mb-4">
        Your Title
      </h1>
      <p className="text-xl">Your subtitle</p>
    </div>
  </div>
</section>
```

### Template 2: Card Grid
```tsx
<section className="relative py-20">
  <div className="absolute inset-0 bg-gradient-extended-medium-4" />
  <div className="relative z-10 container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="glass-medium p-6 rounded-xl">
          {item.content}
        </div>
      ))}
    </div>
  </div>
</section>
```

### Template 3: Dashboard Section
```tsx
<div className="relative rounded-2xl overflow-hidden">
  <div className="absolute inset-0 bg-gradient-extended-subtle-1" />
  <div className="relative glass-light p-8">
    <h2 className="text-2xl font-bold mb-4">Section Title</h2>
    <div className="space-y-4">
      {/* Your dashboard content */}
    </div>
  </div>
</div>
```

---

**That's it! Start with these patterns and customize as needed. Happy coding! 🎉**

