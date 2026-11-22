# Genotxt
⚠️ Warning: Beta Version
## About
Genotxt is a text-to-diagram tool for creating genograms.

Inspired by PlantUML and Mermaid, it allows you to generate complex family trees using simple text syntax.

## Basic concept
Genotxt focuses on depicting biological relationships and lineages.
The core logic is designed to visualize unions and their offspring.

## How to Use
### Defining Characters
Define one person per line.
Use the ID followed by the name in brackets/parentheses.

The type of brackets determines the gender or status:
- `id[Name]` -> Male
- `id(Name)` -> Female
- `id<Name>` -> Fetus
- `id/Name/` -> Other

### Relations
To represent a union or relationship:

`id1_id2`

### Children
To represent offspring resulting from a union:

`id1_id2:id3,id4,id5`

## Roadmap / Future Plans
- [ ] Support for dates of birth and death.
## Out of Scope (No plans for implementation)
- Custom color themes and decorative designs.
- Representation of inbreeding.
- Specific support for LGBTQ+ relationships (focusing strictly on biological lineage).
