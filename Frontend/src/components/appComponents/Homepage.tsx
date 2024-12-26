    import { Card, CardContent } from "@/components/ui/card"
    import { useUserState } from "@/recoil/user"
    import { Users, Sparkles, ShieldCheck, IndianRupee, ChevronRight, Star } from 'lucide-react'
    import { useNavigate } from "react-router-dom"
    
    export default function Homepage() {
        
        const [user,] = useUserState()
        const navigate = useNavigate()
    
        const sareeImages = [
            { src: "/S1.png", alt: "Silk Sarees", Discription: "Pure silk sarees with rich zari work" },
            { src: "/B1.png", alt: "Banarasi Sarees", Discription: "Handwoven Banarasi silk sarees" },
            { src: "/D1.png", alt: "Designer Sarees", Discription: "Contemporary fusion designs" },
            { src: "/K1.png", alt: "Kanjivaram Sarees", Discription: "Timeless silk treasures" },
        ]
    
        return (
            <div className="flex flex-col min-h-screen bg-background">
                {/* Hero Section with Luxury Saree Image */}
                <div className="relative w-full h-[600px]">
                    <img
                        src={"/bg2.png"}
                        alt="Luxury Saree Collection"
                        className="object-cover h-[600px] w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent">
                        <div className="container mx-auto px-4 h-full flex items-center">
                            <div className="max-w-xl text-white">
                                <h1 className="text-5xl font-bold mb-4 leading-tight">
                                    Discover Elegance in Every Fold
                                </h1>
                                <p className="text-xl mb-8">
                                    Join our exclusive network of luxury saree entrepreneurs
                                </p>
                                <button className="bg-black/50 hover:bg-black text-white px-8 py-3 rounded-full text-lg font-semibold transition-all" onClick={() => {
                                    if(user){
                                        navigate("/dashboard")
                                        return
                                    }
                                    navigate("/register")
                                    }}>
                                    Start Your Journey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Explore Our Collection Section */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4">Explore Our Collection</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Discover our exquisite range of traditional and contemporary sarees
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sareeImages.map((saree, index) => {
                                return (
                                    <div id={index.toString()} className="relative group overflow-hidden rounded-2xl h-[400px]">
                                        <img
                                            src={saree.src}
                                            alt={saree.alt}
                                            className="object-cover transition-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent">
                                            <div className="absolute bottom-0 left-0 right-0 p-6 cursor-pointer" onClick={() => navigate("/products")}>
                                                <h3 className="text-2xl font-bold text-white mb-2">{saree.alt}</h3>
                                                <p className="text-white/90 mb-4">{saree.Discription}</p>
                                                <span className="text-white/90 text-sm inline-flex items-center">
                                                    Explore Collection <ChevronRight className="w-4 h-4 ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
    
                {/* Why Choose Us Section */}
                <section className="py-16 bg-accent/5">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Join a community of successful entrepreneurs in the luxury saree business
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <ShieldCheck className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Authentic Products</h3>
                                <p className="text-muted-foreground">100% genuine handcrafted sarees</p>
                            </div>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <Users className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Strong Network</h3>
                                <p className="text-muted-foreground">Join our growing community of 10,000+ partners</p>
                            </div>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <IndianRupee className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">High Earnings</h3>
                                <p className="text-muted-foreground">Attractive commission structure</p>
                            </div>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <Sparkles className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Exclusive Benefits</h3>
                                <p className="text-muted-foreground">Special rewards and recognition</p>
                            </div>
                        </div>
                    </div>
                </section>
    
                {/* How to Start Earning Section */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-4">Your Path to Success</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Begin your entrepreneurial journey with our simple four-step process
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-20 h-20  rounded-full flex items-center justify-center  text-2xl font-bold mb-6 shadow-lg">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Register & Verify</h3>
                                <p className="text-center text-muted-foreground">Complete your profile verification process</p>
                                {/* Connector line */}
                                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-primary to-primary/50 -z-10"></div>
                            </div>
    
                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-20 h-20  rounded-full flex items-center justify-center  text-2xl font-bold mb-6 shadow-lg">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Activate Your Account</h3>
                                <p className="text-center text-muted-foreground">Select your business starter package</p>
                                {/* Connector line */}
                                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-primary to-primary/50 -z-10"></div>
                            </div>
    
                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Build Network</h3>
                                <p className="text-center text-muted-foreground">Grow your team and expand your business</p>
                                {/* Connector line */}
                                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-primary to-primary/50 -z-10"></div>
                            </div>
    
                            {/* Step 4 */}
                            <div className="relative flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                                    4
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
                                <p className="text-center text-muted-foreground">Enjoy lucrative commissions and bonuses</p>
                            </div>
                        </div>
                    </div>
                </section>
    
                {/* Featured Sarees Carousel */}
                <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="">
              <h2 className="text-4xl font-bold text-center mb-4">What Our Partners Say</h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Real experiences from our successful business partners
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 cursor-pointer">
                {/* Review 1 */}
                <Card className="border border-border hover:bg-accent/5 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">Priya Sharma</h3>
                            <p className="text-muted-foreground text-sm">@priyasarees</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                        I got so many compliments for this saree. I was talk of the town literally. It really compliment me very well. Very simple yet so elegant and classy. Just love it. 🙏
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>2 days ago</span>
                          <span>•</span>
                          <span>Mumbai, India</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                {/* Review 2 */}
                <Card className="border border-border hover:bg-accent/5 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">Anjali Patel</h3>
                            <p className="text-muted-foreground text-sm">@anjali_boutique</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary" />
                            ))}
                            <Star className="w-4 h-4 fill-muted stroke-muted-foreground" />
                          </div>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          From a small start to building a team of 50+ members! This platform has transformed my life.💫 #WomenEntrepreneurs
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>1 week ago</span>
                          <span>•</span>
                          <span>Ahmedabad, India</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                {/* Review 3 */}
                <Card className="border border-border hover:bg-accent/5 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">Meera Reddy</h3>
                            <p className="text-muted-foreground text-sm">@meera_silks</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-muted-foreground">
                          Just hit my first milestone of 100 sales! 🎉 The collection of Kanjivaram sarees is absolutely stunning. My customers love the authenticity and craftsmanship. Forever grateful for this opportunity! ✨ #BusinessGrowth
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                          <span>3 days ago</span>
                          <span>•</span>
                          <span>Chennai, India</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                {/* Review 4 */}
                <Card className="border border-border hover:bg-accent/5 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">Ritu Verma</h3>
                            <p className="text-muted-foreground text-sm">@ritu_ethnic</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          The business model is brilliant! Started part-time and now running full-time with amazing returns. The Banarasi collection is a huge hit in my network. Thank you for this platform! 🙌 #SareeBusinessSuccess
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>5 days ago</span>
                          <span>•</span>
                          <span>Varanasi, India</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
    
          <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex items-center w-1/3 h-1/3">
              <img src="/logoJDLifestyle.jpeg" alt="" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-black">About Our Legacy</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a vision to empower entrepreneurs in the traditional saree business, 
                  we bring together the richness of Indian craftsmanship and modern business opportunities.
                </p>
                <p>
                  Our platform connects skilled artisans, ambitious entrepreneurs, and saree 
                  enthusiasts, creating a thriving ecosystem that preserves and promotes India's 
                  textile heritage while generating sustainable income opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-2">
                <p>Email: info@example.com</p>
                <p>Phone: +91 1234567890</p>
                <p>Address: 123, Silk Street, Mumbai, Maharashtra, India</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><div className="hover:text-white transition-colors cursor-pointer">Home</div></li>
                <li><div onClick={()=>navigate("/products")} className="hover:text-white transition-colors cursor-pointer">Collections</div></li>
                <li><div onClick={() => {
                    if(user){
                        navigate("/dashboard")
                        return
                    }
                        navigate("/register")
                    }} className="hover:text-white transition-colors cursor-pointer">Join Us</div></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 py-6 text-center">
            <p>&copy; {new Date().getFullYear()} JD Lifestyle. All rights reserved. | Designed with ❤️ </p>
          </div>
        </div>
      </footer>
            </div>
        )
    }
    
    