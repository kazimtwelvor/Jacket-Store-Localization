import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Award, Globe, Users, Heart } from "lucide-react"
import Container from "../../ui/container"
import Button from "../../ui/button"

export const metadata: Metadata = {
  title: "About Us | FINEYST",
  description: "Learn about our story, mission, and the team behind FINEYST.",
}

export default function AboutUsPage() {
  return (
    <section className="bg-background pb-20">
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-10">
          <div
            style={{
              backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: `40px 40px`,
            }}
            className="w-full h-full"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-[#333333] mb-6">
              Crafting exceptional fashion experiences since 2010
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: Award, text: "Quality Crafted" },
                { icon: Globe, text: "Sustainable" },
                { icon: Users, text: "Global Reach" },
                { icon: Heart, text: "Customer First" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#F6F6F6] flex items-center justify-center mb-3 shadow-md">
                    <item.icon className="w-7 h-7 text-black" />
                  </div>
                  <p className="font-medium text-black">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Container>
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-6 rounded-non">
                At FINEYST, we believe that fashion is more than just clothing—it's a form of self-expression, a
                statement of identity, and a celebration of individuality.
              </p>
              <p className="text-muted-foreground text-lg mb-6">
                Our mission is to provide high-quality, sustainable fashion that empowers people to express themselves
                authentically while minimizing our environmental footprint.
              </p>
              <div className="mt-8">
                <Button size="lg" className="mr-4 bg-[#eaeaea] hover:bg-[#f6f6f6] text-black rounded-none" asChild>
                  <Link href="/shop">Shop Collection</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-white hover:bg-[#1B1B1B]/10 rounded-none"
                  asChild
                >
                  <Link href="/blogs">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/sustainable-fashion-production.png"
                alt="Our sustainable practices"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </Container>

      <section className="bg-background py-16 md:py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core principles guide everything we do, from design to delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainability",
                description:
                  "We're committed to reducing our environmental impact through responsible sourcing and production methods.",
                icon: "🌱",
              },
              {
                title: "Quality",
                description:
                  "We believe in creating products that last, reducing waste and providing better value to our customers.",
                icon: "✨",
              },
              {
                title: "Inclusivity",
                description:
                  "We design for everybody, celebrating diversity in all its forms through our products and practices.",
                icon: "🤝",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate individuals behind FINEYST who bring our vision to life every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                image: "/professional-headshot-1.png",
              },
              {
                name: "Sam Rivera",
                role: "Creative Director",
                image: "/professional-headshot-2.png",
              },
              {
                name: "Taylor Kim",
                role: "Head of Sustainability",
                image: "/professional-headshot-3.png",
              },
              {
                name: "Jordan Patel",
                role: "Lead Designer",
                image: "/professional-headshot-4.png",
              },
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative h-[300px] rounded-lg overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-xl">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <section className="bg-background py-16 md:py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From humble beginnings to where we are today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-black hidden md:block"></div>

            {/* Timeline events */}
            <div className="space-y-16">
              {/* 2010 - Left */}
              <div className="relative md:grid md:grid-cols-2 items-center">
                <div className="hidden md:block">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mr-8 ml-auto">
                    <span className="inline-block px-3 py-1 bg-[#eaeaea] text-black rounded-full text-sm font-medium mb-3">
                      2010
                    </span>
                    <h3 className="text-xl font-bold mb-2">The Beginning</h3>
                    <p className="text-muted-foreground">
                      FINEYST was founded with a simple mission: to create sustainable fashion that doesn't compromise
                      on style.
                    </p>
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2b2b2b] rounded-full hidden md:block"></div>

                <div className="hidden md:block"></div>

                <div className="md:hidden">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 bg-[#eaeaea] text-black rounded-full text-sm font-medium mb-3">
                      2010
                    </span>
                    <h3 className="text-xl font-bold mb-2">The Beginning</h3>
                    <p className="text-muted-foreground">
                      FINEYST was founded with a simple mission: to create sustainable fashion that doesn't compromise
                      on style.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative md:grid md:grid-cols-2 items-center">
                <div className="hidden md:block"></div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2b2b2b] rounded-full hidden md:block"></div>

                <div className="hidden md:block">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-8">
                    <span className="inline-block px-3 py-1 bg-[#eaeaea] text-black rounded-full text-sm font-medium mb-3">
                      2015
                    </span>
                    <h3 className="text-xl font-bold mb-2">Going Global</h3>
                    <p className="text-muted-foreground">
                      We expanded our operations to reach customers worldwide, bringing our sustainable fashion to new
                      markets.
                    </p>
                  </div>
                </div>

                <div className="md:hidden">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 bg-[#eaeaea] text-black rounded-full text-sm font-medium mb-3">
                      2015
                    </span>
                    <h3 className="text-xl font-bold mb-2">Going Global</h3>
                    <p className="text-muted-foreground">
                      We expanded our operations to reach customers worldwide, bringing our sustainable fashion to new
                      markets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative md:grid md:grid-cols-2 items-center">
                <div className="hidden md:block">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mr-8 ml-auto">
                    <span className="inline-block px-3 py-1 bg-[#eaeaea] text-black rounded-full text-sm font-medium mb-3">
                      2018
                    </span>
                    <h3 className="text-xl font-bold mb-2">Sustainability Pledge</h3>
                    <p className="text-muted-foreground">
                      We committed to using 100% sustainable materials by 2025, setting a new standard in the industry.
                    </p>
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full hidden md:block"></div>

                <div className="hidden md:block"></div>

                <div className="md:hidden">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 bg-[#EAEAEA] text-black rounded-full text-sm font-medium mb-3">
                      2018
                    </span>
                    <h3 className="text-xl font-bold mb-2">Sustainability Pledge</h3>
                    <p className="text-muted-foreground">
                      We committed to using 100% sustainable materials by 2025, setting a new standard in the industry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative md:grid md:grid-cols-2 items-center">
                <div className="hidden md:block"></div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full hidden md:block"></div>

                <div className="hidden md:block">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-8">
                    <span className="inline-block px-3 py-1 bg-[#EAEAEA] text-black rounded-full text-sm font-medium mb-3">
                      2023
                    </span>
                    <h3 className="text-xl font-bold mb-2">Innovation Hub</h3>
                    <p className="text-muted-foreground">
                      We launched our innovation center to develop new sustainable fabrics and manufacturing processes.
                    </p>
                  </div>
                </div>

                <div className="md:hidden">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 bg-[#EAEAEA] text-black rounded-full text-sm font-medium mb-3">
                      2023
                    </span>
                    <h3 className="text-xl font-bold mb-2">Innovation Hub</h3>
                    <p className="text-muted-foreground">
                      We launched our innovation center to develop new sustainable fabrics and manufacturing processes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Be part of our story as we continue to redefine sustainable fashion for the future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-[#EAEAEA] hover:bg-[#eaeaea] text-black rounded-none" asChild>
              <Link href="/shop">Explore Collection</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#2b2b2b] hover:bg-[#EAEAEA] hover:bg-[#EAEAEA]/10 rounded-none"
              asChild
            >
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </Container>
    </section>
  )
}
