import argparse
import pywikibot

url="https://osrs-dev.weirdgloop.org/api.php"
filename = "MediaWiki:Gadget-wikisync-core.js"

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command")
get_parser = subparsers.add_parser("get")
write_parser = subparsers.add_parser("write")
write_parser.add_argument("--username", required=True)
args = parser.parse_args()

if args.command == "get":
    site = pywikibot.Site(url=url)
    page = pywikibot.Page(site, filename)
    print(page.text)
    with open(filename, "w") as f:
        f.write(page.text)

elif args.command == "write":
    site = pywikibot.Site(url=url, user=args.username)
    page = pywikibot.Page(site, filename)
    with open(filename, "r") as f:
        page.text = f.read()
    page.save("syncing latest version from file via API")


else:
    parser.print_help()