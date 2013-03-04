package com.tudou.army;

import java.io.*;
import java.util.*;
import java.util.regex.*;

import com.google.javascript.jscomp.CommandLineRunner;

public class JsBuilder {
	private File ��·��;
	private File Ŀ���ļ�;
	private File �ϲ��ļ�;
	private HashSet<String> ȫ��ģ��;
	private LinkedHashSet<File> �ļ��б�;
	private Boolean �Ƿ�ѹ��;
	private File ѹ���ļ�;
	
	static final int Ĭ�� = 0;
	static final int ���� = 1;
	static final int ���� = 2;
	static final int ���� = 3;

	public JsBuilder(File ��·��, File Ŀ���ļ�, HashSet<String> ȫ��ģ��, Boolean �Ƿ�ѹ��) {
		this.��·�� = ��·��;
		this.Ŀ���ļ� = Ŀ���ļ�;
		this.ȫ��ģ�� = ȫ��ģ��;
		this.�Ƿ�ѹ�� = �Ƿ�ѹ��;
		String name = Ŀ���ļ�.getName();
		�ϲ��ļ� = new File(Ŀ���ļ�.getParent(), name.substring(0, name.length() - 7) + ".js");
		ѹ���ļ� = new File(Ŀ���ļ�.getParent(), name.substring(0, name.length() - 7) + ".min.js");
		if(!�ϲ��ļ�.exists()) {
			try {
				�ϲ��ļ�.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
				System.exit(1);
			}
		}
		�ļ��б� = new LinkedHashSet<File>();
	}
	public void ����() {
		StringBuilder ������� = new StringBuilder();
		�ݹ鵼���ļ�(Ŀ���ļ�, �������, Ĭ��);
		System.out.println("---Input:");
		for(File f : �ļ��б�) {
			System.out.println(f);
		}
		���(�������);
		System.out.println("---Output:");
		System.out.println(�ϲ��ļ�);
	}
	private void �ݹ鵼���ļ�(File ��ǰ�ļ�, StringBuilder �������, int ����) {
		if(�ļ��б�.contains(��ǰ�ļ�)) {
			return;
		}
		String ���� = ��ȡ�ļ�����(��ǰ�ļ�);
		String ͷע�� = ��ȡͷע��(����);
		String ����ע������ = ����.substring(ͷע��.length());
		LinkedHashSet<File> �����ļ�,  �����ļ�, �����ļ� = null;
		boolean isModule = �Ƿ�ģ��(����ע������);
		boolean isTpl = �Ƿ�ģ��(��ǰ�ļ�);
		//ģ�塢ģ���ļ�����ͨ�ļ�����
		if(isTpl) {
			//
		}
		else if(isModule) {
			String id = ��ȡģ��ID(����ע������);
			if((���� == ���� || ���� == ����) && ȫ��ģ��.contains(id)) {
				return;
			}
			�����ļ� = ��ȡ�����ļ�(��ǰ�ļ�, ����ע������);
			for(File f : �����ļ�) {
				�ݹ鵼���ļ�(f, �������, ����);
			}
		}
		else {
			�����ļ� = ��ȡͷע�͵����ļ�(��ǰ�ļ�, ͷע��);
			for(File f : �����ļ�) {
				�ݹ鵼���ļ�(f, �������, ����);
			}
			�����ļ� = ��ȡ�����ļ�(����ע������);
			for(File f : �����ļ�) {
				�ݹ鵼���ļ�(f, �������, ����);
			}
		}
		�ļ��б�.add(��ǰ�ļ�);
		if(��ǰ�ļ� != Ŀ���ļ�) {
			ͷע�� = ͷע��.replaceAll(" \\$", " ");
		}
		if(!isTpl) {
			�������.append(ͷע��);
		}
		if(isModule) {
			�������.append("\ndefine.url('");
			�������.append(��ȡģ��URI(��ǰ�ļ�));
			�������.append("');");
		}
		if(isTpl) {
			�������.append("define.url('");
			�������.append(��ȡģ��URI(��ǰ�ļ�));
			�������.append("');");
			�������.append("\ndefine('");
			����ע������ = ����ע������.replaceAll("[\r\n\t]", "");
		}
		�������.append(����ע������);
		if(isTpl) {
			�������.append("');\n");
		}
	}
	private LinkedHashSet<File> ��ȡ�����ļ�(File ��ǰ�ļ�, String ����ע������) {
		LinkedHashSet<File> �ļ��б� = new LinkedHashSet<File>();
		//��ʾ����������
		Pattern p = Pattern.compile("^\\s*define\\s*\\(\\s*\\[([^\\]{();]+)\\]");
		Matcher m = p.matcher(����ע������);
		String s;
		if(m.find()) {
			s = m.group(1);
			p = Pattern.compile("(['\"])(.+?)\\1");
			m = p.matcher(s);
			while(m.find()) {
				s = m.group(2);
				if(!ȫ��ģ��.contains(s)) {
					if(!s.endsWith(".js") && !s.endsWith(".tpl")) {
						s += ".js";
					}
					if(s.charAt(0) == '/') {
						�ļ��б�.add(new File(��·��, s));
					}
					else {
						�ļ��б�.add(new File(��ǰ�ļ�.getParent(), s));
					}
				}
			}
		}
		//��ʽrequire������require("module")������ʾ����ʱʧЧ
		if(�ļ��б�.size() == 0) {
			p = Pattern.compile("(?:^|[^.\\w])\\s*require\\s*\\(\\s*([\"'])(.+?)\\1");
			m = p.matcher(����ע������);
			while(m.find()) {
				s = m.group(2);
				if(!ȫ��ģ��.contains(s)) {
					if(!s.endsWith(".js") && !s.endsWith(".tpl")) {
						s += ".js";
					}
					if(s.charAt(0) == '/') {
						�ļ��б�.add(new File(��·��, s));
					}
					else {
						�ļ��б�.add(new File(��ǰ�ļ�.getParent(), s));
					}
				}
			}
		}
		return �ļ��б�;
	}
	private LinkedHashSet<File> ��ȡ�����ļ�(String ����ע������) {
		LinkedHashSet<File> �ļ��б� = new LinkedHashSet<File>();
		Pattern p = Pattern.compile("(?:^|[^.\\w])\\s*require\\s*\\(([^(]+)");
		Matcher m = p.matcher(����ע������);
		while(m.find()) {
			String s = m.group(1);
			if(s != null) {
				s = s.replaceAll("//@async[\\s\\S]+?([\"']).+?\\1", "");
				Pattern p2 = Pattern.compile("([\"'])(.+?)\\1");
				Matcher m2 = p2.matcher(s);
				while(m2.find()) {
					if(ȫ��ģ��.contains(m2.group(2))) {
						continue;
					}
					s = m2.group(2);
					if(!s.endsWith(".js") && !s.endsWith(".tpl")) {
						s += ".js";
					}
					�ļ��б�.add(new File(��·��, s));
				}
			}
		}
		return �ļ��б�;
	}
	private LinkedHashSet<File> ��ȡͷע�͵����ļ�(File ��ǰ�ļ�, String ע��) {
		LinkedHashSet<File> �ļ��б� = new LinkedHashSet<File>();
		Pattern p = Pattern.compile("@import\\s+(.+)");
		Matcher m = p.matcher(ע��);
		while(m.find()) {
			String s = m.group(1);
			File f = null;
			if(s.endsWith("*")) {
				s = s.substring(0, s.length() - 1);
				if(s.startsWith("/")) {
					f = new File(��·��, s);
				}
				else {
					f = new File(��ǰ�ļ�.getParent(), s);
				}
				File[] list = f.listFiles();
				for(File file : list) {
					if(file.getName().endsWith(".js") || file.getName().endsWith(".tpl")) {
						�ļ��б�.add(file);
					}
				}
			}
			else {
				if(s.startsWith("/")) {
					f = new File(��·��, s);
				}
				else {
					f = new File(��ǰ�ļ�.getParent(), s);
				}
				�ļ��б�.add(f);
			}
		}
		return �ļ��б�;
	}
	private String ��ȡ�ļ�����(File f) {
		BufferedReader br = null;
		String s = null;
		StringBuilder sb = new StringBuilder();
		try {
			br = new BufferedReader(new FileReader(f));
			while((s = br.readLine()) != null) {
				sb.append(s);
				sb.append("\n");
			}
			br.close();
			return sb.toString();
		} catch(IOException e) {
			e.printStackTrace();
			System.exit(1);
		} finally {
			if(br != null) {
				try {
					br.close();
				} catch(IOException e) {
					//
				}
			}
		}
		return "";
	}
	private String ��ȡͷע��(String s) {
		if(s.startsWith("/*")) {
			int i = s.indexOf("*/");
			if(i == -1)
				return "";
			return s.substring(0, i + 2);
		}
		return "";
	}
	private boolean �Ƿ�ģ��(String s) {
		return Pattern.matches("^define\\s*\\([\\s\\S]+", s.trim());
	}
	private String ��ȡģ��ID(String s) {
		if(�Ƿ�ģ��(s)) {
			Pattern p = Pattern.compile("^\\s*define\\s*\\((['\"])(.+?)\\1");
			Matcher m = p.matcher(s);
			if(m.find()) {
				return m.group(2);
			}
			return null;
		}
		return null;
	}
	private boolean �Ƿ�ģ��(File f) {
		return f.getName().endsWith(".tpl");
	}

	private String ��ȡģ��URI(File f) {
		String path = f.getAbsolutePath().substring(��·��.getAbsolutePath().length());
		path = path.replace('\\', '/')
				.replaceAll("\\w+/\\.\\./", "")
				.replace("./", "");
		if(path.endsWith(".js"))
			path = path.substring(0, path.length() - 3);
		if(path.endsWith("_src"))
			path = path.substring(0, path.length() - 4);
		else if(path.endsWith("_combo"))
			path = path.substring(0, path.length() - 6);
		return path;
	}
	private void ���(StringBuilder �������) {
		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new FileWriter(�ϲ��ļ�));
			bw.write(�������.toString());
			bw.close();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch(IOException e) {
					//
				}
			}
		}
		if(�Ƿ�ѹ��) {
			String[] input = new String[4];
			input[0] = "--js=" + �ϲ��ļ�.getAbsolutePath();
			input[1] = "--charset=gbk";
			input[2] = "--js_output_file=" + ѹ���ļ�.getAbsolutePath();
			input[3] = "--warning_level=QUIET";

			CommandLineRunner runner = new CommandLineRunner(input);
			if (runner.shouldRunCompiler())
			{
				runner.run();
			}
		}
	}
	public static void ѹ��(File �ļ�) {
		String �ļ��� = �ļ�.getName();
		File �ϲ��ļ� = �ļ�;
		File ѹ���ļ� = null;
		if(�ļ���.endsWith("_src.js")) {
			�ϲ��ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 7) + ".js");
			if(�ϲ��ļ�.exists()) {
				ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 7) + ".min.js");
			}
			else {
				�ϲ��ļ� = �ļ�;
				ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 7) + ".min.js");
			}
		}
		else {
			ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 3) + ".min.js");
		}
		System.out.println("---Compress:");
		System.out.println(ѹ���ļ�);
		String[] input = new String[4];
		input[0] = "--js=" + �ϲ��ļ�.getAbsolutePath();
		input[1] = "--charset=gbk";
		input[2] = "--js_output_file=" + ѹ���ļ�.getAbsolutePath();
		input[3] = "--warning_level=QUIET";

		CommandLineRunner runner = new CommandLineRunner(input);
		if (runner.shouldRunCompiler())
		{
			runner.run();
		}
	}
}
